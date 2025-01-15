-- use links3db
-- go

if object_id('history', 'U') is not null
begin
    drop table history;
end;
go

if object_id('eventType', 'U') is not null
begin
    drop table eventType;
end;
go

if object_id('userMessages', 'U') is not null
begin
    drop table userMessages;
end;
go

if object_id('links', 'U') is not null
begin
    drop table links;
end;
go

if object_id('lcolumns', 'U') is not null
begin
    drop table lcolumns;
end;
go

if object_id('lrows', 'U') is not null
begin
    drop table lrows;
end;
go

if object_id('pages', 'U') is not null
begin
    drop table pages;
end;
go

if object_id('accounts', 'U') is not null
begin
    drop table accounts;
end;
go

if object_id('GenerateSalt') is not null
begin
    drop procedure GenerateSalt;
end;
go

create procedure GenerateSalt
@salt nvarchar(24) output
as
begin
    set @salt = cast(crypt_gen_random(18) as varchar(24));
end
go

if object_id('HashPassword') is not null
begin
    drop procedure HashPassword;
end;
go

create procedure HashPassword
@password nvarchar(max),
@salt nvarchar(24),
@hashedPassword nvarchar(max) output
as
begin
    set @hashedPassword = convert(nvarchar(max), hashbytes('sha2_512', @password + @salt), 2);
end
go

if object_id('ValidateEmail') is not null
begin
    drop function ValidateEmail;
end;
go

create function ValidateEmail
(
    @email varchar(max)
)
returns bit
as
begin
    declare @result bit = 0;
        
    if @email like '%_@__%.__%' and
        patindex('%[^a-zA-Z0-9@._-]%', @email) = 0 and
        len(@email) >= 6 and
        len(@email) <= 254 and
        @email not like '%@%@%' and
        @email not like '%@.%' and
        @email not like '%.@%' and
        left(@email, 1) not in ('.', '@') and
        right(@email, 1) not in ('.', '@')
    begin
        set @result = 1;
    end;

    return @result;
end
go

if object_id('VerifyPassword') is not null
begin
    drop procedure VerifyPassword;
end;
go
create procedure VerifyPassword
    @providedPassword nvarchar(max),
    @storedHash nvarchar(max),
    @salt nvarchar(24),
    @isValid bit output
as
begin
    declare @calculatedHash nvarchar(max);
    exec HashPassword @providedPassword, @salt, @calculatedHash output;
    set @isValid = case when @calculatedhash = @storedHash then 1 else 0 end;
end
go

if object_id('ValidateLimitedString') is not null
begin
    drop function ValidateLimitedString;
end;
go

create function ValidateLimitedString
(
    @name varchar(max)
)
returns bit
as
begin
        declare @result bit = 0;
        
        if patindex('%[^a-zA-Z0-9-_]%', @name) = 0
        begin
            set @result = 1;
        end;

        return @result;
end
go

create table accounts (
    id int identity(1,1) not null,
    userName varchar(50) not null,
    userEmail varchar(255) not null,
    isAdmin bit not null,
    hashedPassword nvarchar(max) not null,
    salt nvarchar(24) not null,
    firstName nvarchar(100) null,
    lastName nvarchar(100) null,
    settings nvarchar(max) null,
    constraint pk_accounts_id primary key (id),
    constraint uq_accounts_name unique (userName),
    constraint uq_accounts_email unique (userEmail),
    constraint ch_accounts_name_min_length check (len(userName) >= 3),
    constraint ch_accounts_name_characters check (weblinks.ValidateLimitedString(userName) = 1),
    constraint ch_accounts_email_max_length check(len(userEmail) <= 254),
    constraint ch_accounts_email check (weblinks.ValidateEmail(userEmail) = 1)
);
go

alter table accounts add constraint df_accounts_isAdmin default 0 for isAdmin
go

create table pages (
    id int identity(1,1) not null,
    accountId int not null,
    pagePath varchar(50) not null,
    caption nvarchar(50) null,
    constraint pk_pages_id primary key (id),
    constraint fk_pages_account_id foreign key (accountId) references accounts(id) on delete cascade,
    constraint uq_page_path unique (accountId, pagePath),
    constraint uq_page_path_len check(len(pagePath) >= 3),
    constraint ch_pages_path_characters check (weblinks.ValidateLimitedString(pagePath) = 1),
); 
go

create table lrows (
    id int identity(1,1) not null,
    pageId int not null,
    caption nvarchar(50) null,
    constraint pk_lrows_id primary key (id),
    constraint fk_lrows_page_id foreign key (pageId) references pages(id) on delete cascade,
); 
go

create table lcolumns (
    id int identity(1,1) not null,
    rowId int not null,
    caption nvarchar(50) null,
    constraint pk_lcolumns_id primary key (id),
    constraint fk_lcolumns_row_id foreign key (rowId) references lrows(id) on delete cascade,
); 
go

create table links (
    id int identity(1,1) not null,
    columnId int not null,
    aUrl nvarchar(max) not null,
    caption nvarchar(50) not null,
    constraint pk_links_id primary key (id),
    constraint fk_links_column_id foreign key (columnId) references lcolumns(id) on delete cascade,
); 
go

create table userMessages (
    id int identity(1,1) not null,
    accountId int not null,
    asubject nvarchar(max) not null,
    amessage nvarchar(max) not null,
    utcDate datetime2(7) default sysdatetimeoffset() at time zone 'UTC',
    constraint pk_userMessages_id primary key (id),
    constraint fk_userMessages_accountId foreign key (accountId) references accounts(id) on delete cascade,
); 
go

create table eventType (
    id int not null,
    typeName varchar(50) not null,
    constraint pk_eventType_id primary key (id),
    constraint uq_eventType_name unique (typeName)
); 
go

create table history (
    id int identity(1,1) not null,
    eventTypeId int not null,
    userEmail varchar(255) null,
    utcDate datetime2(7) default sysdatetimeoffset() at time zone 'UTC',
    comment nvarchar(max) null,
    constraint pk_history_id primary key (id),
    constraint fk_history_eventTypeId foreign key (eventTypeId) references eventType(id)
); 
go

if object_id('ValidateNewAccount') is not null
begin
    drop procedure ValidateNewAccount;
end;
go

create procedure ValidateNewAccount
    @userName varchar(max),
    @userEmail varchar(max),
    @existingAccountId int,
    @message varchar(max) output
as
begin
    if @userName is null or len(@userName) = 0
    begin
        set @message = 'User name is required';
    end else if len(@userName) < 3 or len(@userName) > 50
    begin
        set @message = 'Username length must be between 3 and 50 characters';
    end else if weblinks.ValidateLimitedString(@userName) = 0
    begin
        set @message = 'Username can only contain the characters a-z, A-Z and 0-1';
    end else if @userEmail is null or len(@userEmail) = 0
    begin
        set @message = 'Email is required';
    end else if len(@userEmail) < 6 or len(@userEmail) > 254
    begin
        set @message = 'Email length must be between 6 and 254 characters';
    end else if weblinks.ValidateEmail(@userEmail) = 0
    begin
        set @message = 'Invalid email';
    end else if exists (select null from accounts where userEmail = @userEmail and (@existingAccountId = 0 or id != @existingAccountId))
    begin
        set @message = 'Account with email ' + @userEmail + ' already exists';
    end else if exists (select null from accounts where userName = @userName and (@existingAccountId = 0 or id != @existingAccountId))
    begin
        set @message = 'Account with user name ' + @userName + ' already exists';
    end else
    begin
        set @message = '';
    end;
end
go

