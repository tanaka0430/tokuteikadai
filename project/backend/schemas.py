from pydantic import BaseModel

class UserBase(BaseModel):
    name:str = ""

class UserCreate(UserBase):
    password:str = ""

class User(UserBase):
    id:int
    is_active:bool
    class Config:
        from_attributes = True
  
class AoyamaKougiBase(BaseModel):
    id: int
    時限: str
    科目: str
    教員: str
    単位: str
    開講: str
    学年: str
    メッセージ: str
    url: str

    class Config:
        from_attributes = True  
        
class SearchRequest(BaseModel):
    campuses: list[str] = []
    dayPeriodCombinations: list[str] = []
    departments: list[str] = []
    semester: str = "指定なし"
    courseName: str = ""
    instructorName: str = ""