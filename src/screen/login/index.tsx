import QueryString from "qs";
import React, { FormEvent } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

interface LoginBase {
  id: number;
}

interface Person extends LoginBase {
  name: string;
}

const test = (p: LoginBase) => {};

// ts是鸭子类型（duck typing）： 面向接口编程，而不是面向对象编程
// 如const a = { id: 1, name: "jenny" }; 这句即便a非Person也是一样编译通过
const a: Person = { id: 1, name: "jenny" };

test(a);

export const LoginScreen = () => {
  // HTMLFormElement extends Element
  // 所以虽然onSubmit的参数指定为FormEvent<HTMLFormElement>，但handleSubmit的参数设为FormEvent<Element>也可以通过校验
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    //阻止表单在无操作情况下提交
    event.preventDefault();
    const username = (event.currentTarget.elements[0] as HTMLInputElement)
      .value;
    const password = (event.currentTarget.elements[1] as HTMLInputElement)
      .value;

    login({ username, password });
  };

  const login = (param: { username: string; password: string }) => {
    fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(param),
    }).then(async (response) => {
      if (response.ok) {
        alert(`${param.username}登录成功`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">用户名</label>
        <input type="text" id={"username"} />
      </div>
      <div>
        <label htmlFor="password">密码</label>
        <input type="text" id={"password"} />
      </div>

      <button type="submit">登录</button>
    </form>
  );
};
