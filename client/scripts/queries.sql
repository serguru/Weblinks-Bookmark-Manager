select *
from pages a
left join lrows b on b.pageId = a.Id
left join lcolumns c on c.rowId = b.id
left join links l on l.columnId = c.id
where 
a.accountId = 5

