### 1. Generate Model, Service, Controller theo file `schema.dbml`
```
./cli.sh g
```
### 2. Generate Model (Tên model viết thường, danh từ số nhiều, tiếng anh)
```
./cli.sh g model users name:string,age:number
./cli.sh g model posts name:string,content:string,author_id:number,heart:number
```
### 3. Generate Controller
```
./cli.sh g controller users
```
### 4. Generate Service
```
./cli.sh g service users
```