### 1. RawQuery
Ví dụ:

```
@RawQuery('SELECT * FROM ACCOUNTS WHERE phone = $1 AND status = $2', Account)
static findByAccount(_phone: string, _status: number): [] {
    return [];
}
```