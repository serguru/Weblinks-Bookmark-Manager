use weblinks_db
go

select *
from pages a
left join lrows b on b.pageId = a.Id
left join lcolumns c on c.rowId = b.id
left join links l on l.columnId = c.id
where 
a.accountId >= 5

SELECT TOP (1000) [id]
      ,[comment]
      ,[utcDate]
	  ,SWITCHOFFSET([utcDate], DATEPART(TZOFFSET, SYSDATETIMEOFFSET())) as locaTime
FROM [weblinks_db].[weblinks].[systemInfo]


