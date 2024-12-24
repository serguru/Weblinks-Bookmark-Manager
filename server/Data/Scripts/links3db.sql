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
    id int identity(1,1) not null primary key,
    userName varchar(50) not null unique check(len(userName) >= 3),
    hashedPassword varbinary(64) not null,
    salt varbinary(16) not null,
    firstName nvarchar(100) null,
    lastName nvarchar(100) null,
    settings nvarchar(max) null
);
go

create table pages (
    id int identity(1,1) not null primary key,
    accountId int not null references accounts(id),
    pagePath varchar(50) not null check(len(pagePath) >= 3),
    caption varchar(50) null,
    constraint uq_path unique (accountId, pagePath)
); 
go

create table lrows (
    id int identity(1,1) not null primary key,
    pageId int not null references pages(id),
    caption varchar(50) null,
); 
go

create table lcolumns (
    id int identity(1,1) not null primary key,
    rowId int not null references lrows(id),
    caption varchar(50) null,
); 
go

create table links (
    id int identity(1,1) not null primary key,
    columnId int not null references lcolumns(id),
    aUrl varchar(max) not null,
    caption varchar(50) not null,
); 
go


