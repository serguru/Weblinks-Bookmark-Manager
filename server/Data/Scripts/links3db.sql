use links3db
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

create table accounts (
    id int identity(1,1) not null,
    userName varchar(50) not null ,
    hashedPassword varbinary(64) not null,
    salt varbinary(16) not null,
    firstName nvarchar(100) null,
    lastName nvarchar(100) null,
    settings nvarchar(max) null,

    constraint pk_accounts_id primary key (id),
    constraint uq_accounts_name unique (userName),
    constraint uq_accounts_len check(len(userName) >= 3)
);
go

create table pages (
    id int identity(1,1) not null,
    accountId int not null,
    pagePath varchar(50) not null,
    caption varchar(50) null,
    constraint pk_pages_id primary key (id),
    constraint fk_pages_account_id foreign key (accountId) references accounts(id),
    constraint uq_page_path unique (accountId, pagePath),
    constraint uq_page_path_len check(len(pagePath) >= 3)
); 
go

create table lrows (
    id int identity(1,1) not null,
    pageId int not null,
    caption varchar(50) null,
    constraint pk_lrows_id primary key (id),
    constraint fk_lrows_page_id foreign key (pageId) references pages(id),
); 
go

create table lcolumns (
    id int identity(1,1) not null,
    rowId int not null,
    caption varchar(50) null,
    constraint pk_lcolumns_id primary key (id),
    constraint fk_lcolumns_row_id foreign key (rowId) references lrows(id),
); 
go

create table links (
    id int identity(1,1) not null,
    columnId int not null,
    aUrl varchar(max) not null,
    caption varchar(50) not null,
    constraint pk_links_id primary key (id),
    constraint fk_links_column_id foreign key (columnId) references lcolumns(id),
); 
go


