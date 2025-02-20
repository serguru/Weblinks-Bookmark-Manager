use weblinks_db
go

select *
from weblinks.pages a
left join weblinks.lrows b on b.pageId = a.Id
left join weblinks.lcolumns c on c.rowId = b.id
left join weblinks.links l on l.columnId = c.id
where 
a.accountId >= 5
go

SELECT TOP (1000) [id]
      ,[comment]
      ,[utcStartDate]
      ,[utcEndDate]
    ,FORMAT([utcStartDate] AT TIME ZONE 'UTC' AT TIME ZONE 'Pacific Standard Time', 'HH:mm') AS LocalStart
    ,FORMAT([utcEndDate] AT TIME ZONE 'UTC' AT TIME ZONE 'Pacific Standard Time', 'HH:mm') AS LocalEnd
    ,DATEDIFF(MINUTE, [utcStartDate], [utcEndDate]) as 'Interval in min'
FROM [weblinks].[systemInfo]
order by id desc
go

select * from weblinks.userMessages
go
