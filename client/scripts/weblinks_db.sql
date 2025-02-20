use weblinks_db
go

if object_id('weblinks.vwAccountsData') is not null
begin
    drop view weblinks.vwAccountsData;
end;
go

if object_id('weblinks.vwSearchPages') is not null
begin
    drop view weblinks.vwSearchPages;
end;
go

if object_id('weblinks.systemInfo') is not null
begin
    drop table weblinks.systemInfo;
end;
go

if object_id('weblinks.archiveTasks') is not null
begin
    drop table weblinks.archiveTasks;
end;
go

if object_id('weblinks.operTasks') is not null
begin
    drop table weblinks.operTasks;
end;
go

if object_id('weblinks.taskType') is not null
begin
    drop table weblinks.taskType;
end;
go

if object_id('weblinks.history') is not null
begin
    drop table weblinks.history;
end;
go

if object_id('weblinks.eventType') is not null
begin
    drop table weblinks.eventType;
end;
go

if object_id('weblinks.userMessages') is not null
begin
    drop table weblinks.userMessages;
end;
go

if object_id('weblinks.links') is not null
begin
    drop table weblinks.links;
end;
go

if object_id('weblinks.lcolumns') is not null
begin
    drop table weblinks.lcolumns;
end;
go

if object_id('weblinks.lrows') is not null
begin
    drop table weblinks.lrows;
end;
go

if object_id('weblinks.pages') is not null
begin
    drop table weblinks.pages;
end;
go

if object_id('weblinks.accounts') is not null
begin
    drop table weblinks.accounts;
end;
go

if object_id('weblinks.GenerateSalt') is not null
begin
    drop procedure weblinks.GenerateSalt;
end;
go

create procedure weblinks.GenerateSalt
@salt nvarchar(24) output
as
begin
    set @salt = cast(crypt_gen_random(18) as varchar(24));
end
go

if object_id('weblinks.HashPassword') is not null
begin
    drop procedure weblinks.HashPassword;
end;
go

create procedure weblinks.HashPassword
@password nvarchar(max),
@salt nvarchar(24),
@hashedPassword nvarchar(max) output
as
begin
    set @hashedPassword = convert(nvarchar(max), hashbytes('sha2_512', @password + @salt), 2);
end
go

if object_id('weblinks.ValidateEmail') is not null
begin
    drop function weblinks.ValidateEmail;
end;
go

create function weblinks.ValidateEmail
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

if object_id('weblinks.VerifyPassword') is not null
begin
    drop procedure weblinks.VerifyPassword;
end;
go
create procedure weblinks.VerifyPassword
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

if object_id('weblinks.ValidateLimitedString') is not null
begin
    drop function weblinks.ValidateLimitedString;
end;
go

create function weblinks.ValidateLimitedString
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

create table weblinks.accounts (
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

alter table weblinks.accounts add constraint df_accounts_isAdmin default 0 for isAdmin
go

create table weblinks.pages (
    id int identity(1,1) not null,
    accountId int not null,
    pagePath varchar(50) not null,
    caption nvarchar(50) null,
    isReadOnly bit not null default 0,
    isPublic bit not null default 0,
    pageDescription nvarchar(max) NULL
    constraint pk_pages_id primary key (id),
    constraint fk_pages_account_id foreign key (accountId) references weblinks.accounts(id) on delete cascade,
    constraint uq_page_path unique (accountId, pagePath),
    constraint uq_page_path_len check(len(pagePath) >= 3),
    constraint ch_pages_path_characters check (weblinks.ValidateLimitedString(pagePath) = 1),
); 
go

create table weblinks.lrows (
    id int identity(1,1) not null,
    pageId int not null,
    caption nvarchar(50) null,
    constraint pk_lrows_id primary key (id),
    constraint fk_lrows_page_id foreign key (pageId) references weblinks.pages(id) on delete cascade,
); 
go

create table weblinks.lcolumns (
    id int identity(1,1) not null,
    rowId int not null,
    caption nvarchar(50) null,
    constraint pk_lcolumns_id primary key (id),
    constraint fk_lcolumns_row_id foreign key (rowId) references weblinks.lrows(id) on delete cascade,
); 
go

create table weblinks.links (
    id int identity(1,1) not null,
    columnId int not null,
    aUrl nvarchar(max) not null,
    caption nvarchar(50) not null,
    constraint pk_links_id primary key (id),
    constraint fk_links_column_id foreign key (columnId) references weblinks.lcolumns(id) on delete cascade,
); 
go

create table weblinks.userMessages (
    id int identity(1,1) not null,
    accountId int not null,
    asubject nvarchar(max) not null,
    amessage nvarchar(max) not null,
    utcDate datetime2(7) default sysdatetimeoffset() at time zone 'UTC',
    constraint pk_userMessages_id primary key (id),
    constraint fk_userMessages_accountId foreign key (accountId) references weblinks.accounts(id) on delete cascade,
); 
go

create table weblinks.eventType (
    id int not null,
    typeName varchar(50) not null,
    constraint pk_eventType_id primary key (id),
    constraint uq_eventType_name unique (typeName)
); 
go

-- event types
insert into weblinks.eventType values (1, 'User registered');
insert into weblinks.eventType values (2, 'User logged in');
insert into weblinks.eventType values (3, 'User retrieved the account');
insert into weblinks.eventType values (4, 'User deleted the account');
insert into weblinks.eventType values (5, 'User created a page');
insert into weblinks.eventType values (6, 'User deleted a page');
insert into weblinks.eventType values (7, 'User forgot password');
go

create table weblinks.history (
    id int identity(1,1) not null,
    eventTypeId int not null,
    userEmail varchar(255) null,
    utcDate datetime2(7) default sysdatetimeoffset() at time zone 'UTC',
    comment nvarchar(max) null,
    constraint pk_history_id primary key (id),
    constraint fk_history_eventTypeId foreign key (eventTypeId) references weblinks.eventType(id)
); 
go

create table weblinks.taskType (
    id int not null,
    typeName varchar(50) not null,
    emailSubject nvarchar(max) null,
    emailTemplate nvarchar(max) null,
    constraint pk_taskType_id primary key (id),
    constraint uq_taskType_name unique (typeName)
); 
go

--#region email templates
declare @template nvarchar(max) = 
'
<!DOCTYPE html>
<html>

<head>
	<title>
		Welcome
	</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			background-color: #f2f2f2;
		}

		.container {
			width: 600px;
			margin: 40px auto;
			padding: 20px;
			background-color: #fff;
			border: 1px solid #ddd;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		}

		.header {
			background-color: #333;
			color: #fff;
			padding: 10px;
			text-align: center;
		}

		.content {
			padding: 20px;
			font-size: larger;
		}
	</style>
</head>

<body>
	<div class="container">
		<div class="header">
			<h1>
				Welcome to weblinks.click!
			</h1>
		</div>
		<div class="content">
			<p>
				Dear {{Name}},
			</p>
			<p>
				To get started, please
				<a href="https://weblinks.click/help">
					read our help
				</a>
				and learn how to create and use your own weblinks.
			</p>
			<p>
				If you have any questions or need assistance, please 
				<a href="https://weblinks.click/login">
					login
				</a>				
				and then select "Contact Us" from the site menu. We are always here to support you.				
			</p>
			<p>
				Best regards,
			</p>
			<p>
				Admin
			</p>
		</div>
	</div>
</body>

</html>
'
;
insert into weblinks.taskType values (1, 'Send registration email', 'User registered', @template);

set @template = 
'
<!DOCTYPE html>
<html>
<head>
	<title>Forgot Password Request</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			background-color: #f4f4f4;
		}
		
		.container {
			width: 80%;
			margin: 40px auto;
			background-color: #fff;
			padding: 20px;
			border: 1px solid #ddd;
			border-radius: 10px;
			box-shadow: 0 0 10px rgba(0,0,0,0.1);
		}
		
		.header {
			background-color: #333;
			color: #fff;
			padding: 10px;
			border-bottom: 1px solid #333;
		}
		
		.content {
			padding: 20px;
			font-size: larger;
		}
		
		.button {
			background-color: #4CAF50;
			color: #fff;
			padding: 10px 20px;
			border: none;
			border-radius: 5px;
			cursor: pointer;
		}
		
		.button:hover {
			background-color: #3e8e41;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h2>Forgot Password Request</h2>
		</div>
		<div class="content">
			<p>Dear {{Name}},</p>
			<p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
			<p>To reset your password, click on the button below:</p>
			<a href="{{ResetPasswordLink}}"><button class="button">Reset Password</button></a>
			<p>If you have any issues, please <a href="https://weblinks.click/contact-us">
				contact us
			</a>.</p>
			<p>Best regards,</p>
			<p>Admin</p>
		</div>
	</div>
</body>
</html>
'
insert into weblinks.taskType values (2, 'Send forgot password email', 'Forgot passwod', @template);
go

--#endregion

create table weblinks.operTasks (
    id int identity(1,1) not null,
    historyId int not null,
    taskTypeId int not null,
    constraint pk_operTasks_id primary key (id),
    constraint fk_operTasks_taskTypeId foreign key (taskTypeId) references weblinks.taskType(id),
    constraint fk_operTasks_historyId foreign key (historyId) references weblinks.history(id)
); 
go

create table weblinks.archiveTasks (
    id int identity(1,1) not null,
    historyId int not null,
    taskTypeId int not null,
    completedUtcDate datetime2(7) default sysdatetimeoffset() at time zone 'UTC',
    comment nvarchar(max) null,
    sentEmailSubject nvarchar(max) null,
    sentEmailBody nvarchar(max) null,
    constraint pk_archiveTasks_id primary key (id),
    constraint fk_archiveTasks_taskTypeId foreign key (taskTypeId) references weblinks.taskType(id),
    constraint fk_archiveTasks_historyId foreign key (historyId) references weblinks.history(id)
); 
go

create table weblinks.systemInfo (
    id int identity(1,1) not null,
    comment nvarchar(max) null,
    utcStartDate datetime2(7) not null,
    utcEndDate datetime2(7) null,
    constraint pk_systemInfo_id primary key (id)
); 
go


if object_id('weblinks.ValidateNewAccount') is not null
begin
    drop procedure weblinks.ValidateNewAccount;
end;
go

create procedure weblinks.ValidateNewAccount
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

if object_id('weblinks.ArchiveOperTask') is not null
begin
    drop procedure weblinks.ArchiveOperTask;
end;
go

create procedure weblinks.ArchiveOperTask
    @operTaskId int,
    @comment nvarchar(max),
    @subject nvarchar(max),
    @body nvarchar(max)
as
begin
    begin transaction;

    begin try
        insert into weblinks.archiveTasks (historyId, taskTypeId, comment, sentEmailSubject, sentEmailBody)
            select historyId, taskTypeId, @comment, @subject, @body
            from operTasks
            where   
                id = @operTaskId;

        delete from operTasks
        where
            id = @operTaskId;

        commit transaction;
    end try
    begin catch
        rollback transaction;

        declare @ErrorMessage nvarchar(4000) = error_message();
        declare @ErrorSeverity int = error_severity();
        declare @ErrorState int = error_state();

        raiserror(@ErrorMessage, @ErrorSeverity, @ErrorState);
    end catch;
end
go


create view weblinks.vwAccountsData 
as
    select 
	a.id as AccountId,
	a.userName as userName,
	a.userEmail as userEmail,
	a.firstName as firstName,
	a.lastName as lastName,
	b.id as pageId,
    b.pagePath as pagePath,
    b.caption as pageCaption,
    b.isReadOnly as pageIsReadOnly,
    b.isPublic as pageIsPublic,
    b.pageDescription as pageDescription,
	c.id as rowId,
	c.caption as rowCaption,
	d.id as columnId,
	d.caption as columnCaption,
	e.id as linkId,
	e.caption as linkCaption,
	e.aUrl as linkAUrl
	from weblinks.accounts a
	join weblinks.pages b on b.accountId = a.id
	join weblinks.lrows c on c.pageId = b.id
	join weblinks.lcolumns d on d.rowId = c.id
	join weblinks.links e on e.columnId = d.id
go 
