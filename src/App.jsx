import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'

console.clear();
// 全域變數
const apiBaseUrl = 'https://ec-course-api.hexschool.io/v2';
const apiPath = 'james520284_task2new';


// =================================================
// 登入元件
const SignIn = ({setToken,setExpiredTime}) => {
  // 初始變數
  const [user,setUser] = useState({
    email:'',
    password:'',
  });
  const [messageSignIn,setMessageSignIn] = useState('');
  const [isErrSignIn,setIsErrSignIn] = useState(false);

  // 函式控制
  const userHandle = (e) => {
    const {name,value} = e.target;
    setUser({
      ...user,
      [name]:value,
    });
  };
  
  // 賦值變數 
  const userInfo = {
    "username": user['email'],
    "password": user['password']
  };

  // 伺服器請求 - 送出登入資料
  const postSignIn = async() => {
    try {
      const res = await axios.post(`${apiBaseUrl}/admin/signin`,userInfo);
      setToken(res.data.token);
      setExpiredTime(res.data.expired);
      setMessageSignIn('Loading...');
      setIsErrSignIn(false);
      setUser({
        email:'',
        password:'',
      });
    } catch (err) {
      setMessageSignIn(`登入失敗，原因：${err.response?.data?.message}`);
      setIsErrSignIn(true);
    }
  };

  return(
  <>
    <h1 className='h3 mb-4 text-center'>請先登入</h1>
    <form className='mb-5'>
      <div className="form-floating mb-3">
        <input
        type="email"
        name='email'
        className="form-control"
        id="emailSignInInput"
        placeholder="name@example.com"
        value={user['email']}
        onChange={userHandle}
        />
        <label htmlFor="emailSignInInput">信箱</label>
      </div>
      <div className="form-floating mb-3">
        <input
        type="password"
        name='password'
        className="form-control" 
        id="passwordSignInInput" 
        placeholder="Password"
        value={user['password']}
        onChange={userHandle}
        />
        <label htmlFor="passwordSignInInput">密碼</label>
      </div>
      <button
      type="button"
      className='btn btn-primary w-100 py-2 mb-2 fs-5'
      onClick={postSignIn}
      >登入</button>
      {
        messageSignIn && isErrSignIn &&
        <p className='text-danger'>{messageSignIn}</p>
      }
    </form>
    <p className='text-muted text-center'> &copy;2025 嚼勁先生 </p>
  </>
  )
};

// =================================================
// 後台-產品管理元件
const ProductManage = ({token,author}) => {
  const [productsData,setProductsData] = useState([]);
  const [unitProductsData,setUnitProductsData] = useState(null);

  // 伺服器請求 - 驗證是否登入
  const checkLogin = async () => {
    try {
      const res = await axios.post(`${apiBaseUrl}/api/user/check`,null,author);
      console.log(`已經登入，token：${token}`);
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  };

  // 伺服器請求 - 取得產品資料
  const getProductsData = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/${apiPath}/admin/products/all`,author);
      setProductsData(Object.values(res.data.products));
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  };
  useEffect(()=>{
    getProductsData();
  },[author]);

  return(
  <>
  <div className="container">
    <div className='d-flex justify-content-end'>
      <button type="button" className='btn btn-danger mb-5 '
      onClick={checkLogin}
      >確認是否登入</button>
    </div>
    <div className="row g-4">
      <div className="col-lg-7">
        <h2>產品列表</h2>
        <table className="table">
          <thead>
            <tr>
              <th>產品名稱</th>
              <th>原價</th>
              <th>售價</th>
              <th>是否啟用</th>
              <th>查看細節</th>
            </tr>
          </thead>
          <tbody>
            {
              productsData.length>0?(
                <>
                {
                  productsData.map(item => 
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td>{item.is_enabled?'啟用':'不啟用'}</td>
                    <td><button type="button" className='btn btn-primary'
                    onClick={()=>setUnitProductsData(item)}
                    >產品細節</button></td>
                  </tr>)
                }
                </>
              ):(
                <>
                <tr>
                  <td colSpan="5">尚無產品資料</td>
                </tr>
                </>
              )
            }
          </tbody>
        </table>
      </div>
      <div className="col-lg-5">
        <h2>單一產品細節</h2>
        {
          unitProductsData !==null?(
            <Card unitProductsData={unitProductsData}/>
          ):(
            <p className='text-muted'>請選擇一個商品查看</p>
          )
        }
      </div>
    </div>
  </div>
  </>
  )

};

// =================================================
// 卡片元件
  const Card = ({unitProductsData}) => {
    return(
    <>
    <div className="card">
      <img src={unitProductsData.imageUrl} className="card-img-top" alt="產品主圖"/>
      <div className="card-body">
        <h5 className="card-title">{unitProductsData.title}<span className="badge bg-success ms-2">{unitProductsData.category}</span></h5>
        <p className="card-text">商品描述：{unitProductsData.description}</p>
        <p className="card-text">商品詳情：{unitProductsData.content}</p>
        <div>
          <span className='text-muted'><del>${unitProductsData.origin_price}</del></span><span> / ${unitProductsData.price}</span>
        </div>
        <h5 className='mt-3'>更多圖片</h5>
        <div className="row g-4">
          {
            unitProductsData.imagesUrl.filter(img=>img !== '').map((img,index) => 
              <div className="col-6" key={index}>
                <div className='img-wrap'>
                  <img src={img} alt="產品附圖" className='img-cover'/>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
    </>
    )
  };

// =================================================
// 父元素元件
const App = () => {
  const [token,setToken] = useState('');
  const [expiredTime,setExpiredTime] = useState('');
  const [showProductManage,setShowProductManage] = useState(false);
  document.cookie =`myToken=${token}; expires=${new Date(expiredTime)};`;
  
  const author = {
    headers:{Authorization:token}
  }

  useEffect(()=>{
    if(token){
      const timer = setTimeout(() => {
        setShowProductManage(true);
      }, 4000);
    };
  },[token]);
  
  return (
    <>
    {
      token?(
        showProductManage?(
          <>
          <ProductManage token={token} author={author} />
          </>
        ):(
          <div class="loadingIcon d-flex justify-content-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <span className='ms-3'>Loading...</span>
          </div>
        )
      ):(
        <>
        <div className='signIn-wrap w-25'>
          <SignIn setToken={setToken} setExpiredTime={setExpiredTime}/>
        </div>
        </>
      )
    }
    </>
  )
}

export default App
