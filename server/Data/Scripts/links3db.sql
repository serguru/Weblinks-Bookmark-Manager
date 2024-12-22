use links3db
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
    userName varchar(50) not null unique,
    hashedPassword varbinary(64) not null,
    salt varbinary(16) not null,
    firstName nvarchar(100) null,
    lastName nvarchar(100) null,
);
go

create table pages (
    id int identity(1,1) not null primary key,
    accountId int not null references accounts(id),
    pagePath varchar(100) not null,
    caption varchar(255) null,

    constraint uq_path unique (accountId, pagePath)
); 
go

declare @userName varchar(50) = 'serguru';
declare @plainTextPassword  varchar(50) = 'Binary_09';
declare @salt  varbinary(16) = newid();
declare @hashedPassword varbinary(64) = hashbytes('SHA2_512', concat(@salt, @plainTextPassword));

insert into accounts (userName, hashedPassword, salt, firstName, lastName)
    values (@userName, @hashedPassword, @salt, 'Sergey', 'Chernyshov');

declare @lastIdentity int = @@Identity;

insert into pages (accountId, pagePath, caption)
    values (@lastIdentity, 'main', null);
go
