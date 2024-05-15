// Parent1 类
class Parent1 {
  method1() {
    console.log('Parent1 method1');
  }
}

// Parent2 类
function Parent2() {
  this.method2 = () => {
    console.log('Parent2 method2');
  }
}

// Child 类继承 Parent1 和 Parent2
class Child extends Parent1 {
  constructor() {
    super();
    // 在构造函数中调用 Parent2 的构造函数
    Parent2.call(this);
  }

  method3() {
    console.log('Child method3');
  }
}

// 创建 Child 类的实例
/** @type {Child & Parent2} */
const c = new Child();

// 测试
c.method1(); // Parent1 method1
c.method2();
c.method3(); // Child method3
console.log(c instanceof Child); // true
console.log(c instanceof Parent1); // true
console.log(c instanceof Parent2); // true