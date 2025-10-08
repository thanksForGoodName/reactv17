import { useEffect, useState } from "react";

export const isFalsy = (value: unknown) => (value === 0 ? false : !value);

//在一个函数里，改变传入的对象本身是不好的
export const cleanObject = (object: Object) => {
  const result = { ...object };
  Object.keys(result).forEach((key: string) => {
    const value = result[key as keyof typeof result];
    if (isFalsy(value)) {
      delete result[key as keyof typeof result];
    }
  });
  return result;
};

//自定义hook, 只在组件挂载时执行一次
/**
 * PS: React的hook要求必须以use开头
 * 所有hook只能在函数组件或其他hook中调用
 */
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    // 只在组件挂载时获取用户列表一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

//用泛型来规定类型, 传出的debouncedValue的类型和传入的value一致
export const useDebounce = <T>(value: T, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};


/**
 * @param initialArray 
 * @returns 
 * value: 当前数组
 * add: 添加元素
 * clear: 清空数组
 * removeIndex: 删除指定下标的元素
 */
export const useArray = <T>(initialArray: T[]) => {
  const [value, setValue] = useState(initialArray);
  return {
    value,
    add: (item: T) => setValue([...value, item]),
    clear: () => setValue([]),
    removeIndex: (index: number) => {
      const copy = [...value];
      copy.splice(index, 1);
      setValue(copy);
    }
  }
}
