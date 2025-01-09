import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "taoaura2";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isAuth, setisAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  const checkLogin = async() =>{
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("hexToken="))?.split('=')[1];
      axios.defaults.headers.common.Authorization = token;
      const res = await axios.post(`${API_BASE}/api/user/check`);
      console.log(res);
    }catch(error){
      console.error(error);
    }
  }


  const getData = async()=>{
    try{
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);

      setProducts(res.data.products);
    }catch(error){
      console.error(error);
    }
  }



  const handleInputChange = (e)=>{
    const {id, value} = e.target;

    setFormData((prevData)=>({
      ...prevData,
      [id]:value, //當key執會變動時，用[]新增或更新 id 對應的值 
    }))
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const {token, expired}=res.data

      document.cookie = `hexToken= ${token}; expired=${new Date(expired)}`;
      console.log(document.cookie);
      console.log(res);

      axios.defaults.headers.common.Authorization=`${token}`;

      getData();
      setisAuth(true);
    }catch(error){
      alert('登入失敗：' + error.response.data.message);
    }

  }

  // const handleSubmit = async(e) =>{
  //   e.preventDefault();
  //   try{
  //     const res = await axios.post(`${API_BASE}/admin/signin`, formData);
  //     console.log(res);
  //     const {token, expired} =res.data
  //     document.cookie = `hexToken = ${token}; expired=${new Date(expired)}`;

  //     axios.defaults.headers.common.Authorization = `${token}`;

  //     getData();
  //     setisAuth(true);
  //   } catch (error) {
  //     alert("登次失敗：" + error.response.data.message);
  //   }
  // } 


 

  return (
    <>
    {isAuth ? (
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-6">
            <button
              className="btn btn-danger mb-5"
              type="button"
              id="check"
              onClick={checkLogin}
            >
              確認是否登入
            </button>
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
                {products && products.length > 0 ? (
                  products.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.origin_price}</td>
                      <td>{item.price}</td>
                      <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => setTempProduct(item)}
                        >
                          查看細節
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">尚無產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <h2>單一產品細節</h2>
            {tempProduct ? (
              <div className="card mb-3">
                <img
                  src={tempProduct.imageUrl}
                  className="card-img-top primary-image"
                  alt="主圖"
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {tempProduct.title}
                    <span className="badge bg-primary ms-2">
                      {tempProduct.category}
                    </span>
                  </h5>
                  <p className="card-text">
                    商品描述：{tempProduct.category}
                  </p>
                  <p className="card-text">商品內容：{tempProduct.content}</p>
                  <div className="d-flex">
                    <p className="card-text text-secondary">
                      <del>{tempProduct.origin_price}</del>
                    </p>
                    元 / {tempProduct.price} 元
                  </div>
                  <h5 className="mt-3">更多圖片：</h5>
                  <div className="d-flex flex-wrap">
                    {tempProduct.imagesUrl?.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        className="images"
                        alt="副圖"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-secondary">請選擇一個商品查看</p>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className="container login">
        <div className="row justify-content-center">
          <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
          <div className="col-8">
            <form id="form" className="form-signin" onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="username"
                  placeholder="name@example.com"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  autoFocus
                />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>
              <button
                className="btn btn-lg btn-primary w-100 mt-3"
                type="submit"
              >
                登入
              </button>
            </form>
          </div>
        </div>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    )}
  </>
  )
}

export default App