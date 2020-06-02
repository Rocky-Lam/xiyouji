var tableData = [];//放列表信息
var nowPage = 1; //分页：想要获取的是第几页的数据
var pageSize = 15;//分页： 一页最多有多少个数据
var allPage = 1;// 全部的页数
var prevPage = document.getElementById("prev-btn");// 上一页
var nextPage = document.getElementById("next-btn");// 下一页
var menu = document.getElementsByClassName("menu")[0];//左边侧栏
var studentAddBtn = document.getElementById("student-add-btn");//添加学生按钮
var tbody = document.getElementById("tbody");//学生信息展示栏
var modal = document.getElementsByClassName("modal")[0];//获取编辑表单
var editBtn = document.getElementById("student-edit-btn");// 编辑学生信息按钮
//编辑删除
function bindEvent() {
  //编辑按钮事件
  menu.onclick = function (e) {
    var target = e.target;
    if (target.tagName != "DD") {
      return false;
    }
    var actives = document.getElementsByClassName("active");
    initStyle(actives, "class", target);

    var id = target.getAttribute("data-id") || target.dataset.id;

    var contentChilder = document.getElementsByClassName("content")[0].children;
    initStyle(contentChilder, "display", document.getElementsByClassName(id)[0]);
  };

  //新增学生表单提交
  studentAddBtn.onclick = function (e) {
    //阻止事件刷新
    e.preventDefault();
    var form = document.getElementById("form");//表单 记录各种属性如姓名 年龄
    console.log(form)
    var data = getFormData(form);// 填写后的表单学生数据
    console.log(data)
    if (data) {
      transferData("/api/student/addStudent", data, function () {
        var studnetList = menu.getElementsByTagName("dd")[0]; 
        alert("新增成功！");
        studnetList.click();
        getTableData();//再一次获取到数据列表
        form.reset();//重置表单
      });
    }
  };

  // 编辑信息
  // var queryBox = document.getElementsByClassName("queryBox")[0];//
  tbody.onclick = function (e) {
    var target = e.target;
    if (target.tagName != "BUTTON") {
      return false;
    }
    var key = target.classList.contains("edit");
    var isDete = target.classList.contains("delete");
    var index = target.dataset.index;
    if (key) {
      modal.style.display = "block";
      renderEditForm(tableData[index]);
    } else if (isDete) {
      var isDel = confirm("确定删除？");
      if (isDel) {
        transferData(
          "/api/student/delBySno", {
            sNo: tableData[index].sNo
          },function () {
            alert("删除成功！");
            getTableData();
          }
        );
      }
    } else {
      queryBox.style.display = "block";
      console.log("查询");
    }
  };

  //编辑学生信息表单提交
  editBtn.onclick = function (e) {
       e.preventDefault();
    var form = document.getElementById("student-edit-form");//表单 记录各种属性如姓名 年龄
    console.log(form);
    var data = getFormData(form);// 填写后的表单学生数据
    console.log(data);
    if (data) {
      transferData("/api/student/updateStudent", data, function () {
        alert("修改成功！");
        modal.style.display = "none";
        getTableData();
        form.reset();
      });
    }
  };


  //上一页
  prevPage.onclick = function (e) {
    if (nowPage == 1) {}
    nowPage--;
    getTableData();
  };
  //下一页
  nextPage.onclick = function () {
    nowPage++;
    getTableData();
  };
}
bindEvent();
getTableData();

//获取表格数据
function getTableData() {
  // var res = saveData('http://open.duyiedu.com/api/student/findAll',{
  // 	appkey : ''
  // })
  transferData("/api/student/findByPage", {
      page: nowPage,
      size: pageSize
    },
    function (data) {
      allPage = Math.ceil(data.cont / pageSize);
      tableData = data.findByPage;
      randerTable(tableData);
    }
  );
}

//渲染表格
function randerTable(data) {
  var str = "";
  data.forEach(function (item, index) {
    str += `<tr>
					<td>${item.sNo}</td>
					<td>${item.name}</td>
					<td>${item.sex == 0 ? "男" : "女"}</td>
					<td>${item.email}</td>
					<td>${new Date().getFullYear() - item.birth}</td>
					<td>${item.phone}</td>
					<td>${item.address}</td>
					<td>
						<button class="btn edit" data-index = '${index}'>编辑</button>
            <button class="btn delete" data-index = '${index}'>删除</button>
					</td>
				</tr>`;
  });
  document.getElementById("tbody").innerHTML = str;
  var prevPage = document.getElementById("prev-btn");
  var nextPage = document.getElementById("next-btn");
  if (nowPage < allPage) {
    nextPage.style.display = "inline-block";
  } else {
    nextPage.style.display = "none";
  }
  if (nowPage > 1) {
    prevPage.style.display = "inline-block";
  } else {
    prevPage.style.display = "none";
  }
}

//获取数据表单
function getFormData(form) {
  var name = form.name.value;
      sex = form.sex.value;
      email = form.email.value;
      sNo = form.sNo.value;
      phone = form.phone.value;
      address = form.address.value;
      birth = form.birth.value;
  if (!name || !email || !sNo || !phone || !address || !birth) {
    alert("信息填写不全,请检查后提交！");
    return false;
  }
  
  if((!/^\d{4,16}$/.test(sNo))){
    alert('学号应为4-16为数字组成！');
    return false;
  }
  if(!(/\w@\w+\.com$/.test(email))){
    alert('邮箱格式不正确！')
  }
  if(!(/^\d{4}$/.test(birth))){
    alert('出生年份格式有误！')
  }
  if(!(/^\d{11}$/.test(phone))){
    alert('手机号格式有误！')
    return false;
  }
  return {
    name,
    sex,
    email,
    sNo,
    phone,
    address,
    birth
    //name， == name：name 属性名和属性值都一样
  };
}

// 初始化样式
function initStyle(doms, falg, target) {
  for (var i = 0; i < doms.length; i++) {
    if (falg != "class") {
      doms[i].style.display = "none";
    } else {
      doms[i].classList.remove("active");
    }
  }
  if (falg != "class") {
    target.style.display = "block";
  } else {
    target.classList.add("active");
  }
}

//编辑表单的回填
function renderEditForm(data) {
  console.log(data);//数据的集合
  var form = document.getElementById("student-edit-form");//获取编辑表单
  for (var prop in data) {
    if (form[prop]) {
      form[prop].value = data[prop];
    }
  }
}

//减少接口代码冗余
function transferData(url, data, cb) {
  var res = saveData(
    "http://open.duyiedu.com" + url,
    Object.assign({
        appkey: "BigYTWO_1581473678624"
      },
      data
    )
  );
  if (res.status == "fail") {
    alert(res.msg);
  } else {
    cb(res.data);
  }
}

// 接口
function saveData(url, param) {
  var result = null;
  var xhr = null;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (typeof param == "string") {
    xhr.open("GET", url + "?" + param, false);
  } else if (typeof param == "object") {
    var str = "";
    for (var prop in param) {
      str += prop + "=" + param[prop] + "&";
    }
    xhr.open("GET", url + "?" + str, false);
  } else {
    xhr.open("GET", url + "?" + param.toString(), false);
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        result = JSON.parse(xhr.responseText);
      }
    }
  };
  xhr.send();
  return result;
}


