'use strict'

let aside = document.querySelector("#aside_block_lists");
let main = document.querySelector(".main_list");
let btn_Add_List = document.querySelector("#add_list");
let dateBlock = document.querySelector('.date');
let lists = [];
let arrListenerOpen = [];
let arrListenerDel = [];
let arrListenerAddPoint = [];
let listIndex = [];
let renderLI = [];

btn_Add_List.addEventListener("click", () => {

  //Счетчик, нумерация безымянных списков
  let count = lists.length === 0 ? 1 : lists[lists.length - 1].id + 1;

  //Форма ввода названия списка с счетчиком
  let questionName = prompt("Введите название списка", "Один");
  if (questionName === "") {
    questionName = "Безымянный список №" + count; 
  } else if (questionName === null) { 
    return;
  }
  //Функция создания списка (объекта) и добавление его в массив
  function createList(name) {
    let newListId = lists.length === 0 ? 1 : lists[lists.length - 1].id + 1;
    let newList = {
      id: newListId,
      name: name,
      data: [],
      btnDel: 'CLSBTN ' + count,
    };
    lists.push(newList);
  }
  createList(/* questionName */);

  //Функция отображения списка (объекта) из массива
  function render() { 
    let listsBlock = document.createElement('div');
    listsBlock.classList = "elem " + `${count}`;
    listsBlock.innerHTML = `
                            <input class = "INPT" data-count = "${count}" type = "text" placeholder = "Имя листа" value = "${questionName}"/>
                            <button class = "OPNBTN ${count}" data-count = "${count}">${`<img class="OPNBTN_img" src=images/open16.png>`}</button>
                            <button class = "CLSBTN ${count}" data-count = "${count}">${`<img class="CLSBTN_img" data-count = "${count}" src=images/bucket16.png>`}</button>
                            `;
    aside.append(listsBlock);
  }
  render();

//Проверяем на какую конкретно кнопку открытия/удаления нажали и исходя из этого открываем/удаляем нужный нам список-------------------------------------------
  let btnClickOpen = document.querySelectorAll('.OPNBTN');
  let btnClickDel = document.querySelectorAll('.CLSBTN');
  let inputName = document.querySelectorAll('.INPT'); /**/
  let c = 0;
  let c1 = 0;
  //ОТКРЫТЬ - проверка, есть ли на кнопке уже слушатель.
  btnClickOpen.forEach(btn => { 
    if (btn === arrListenerOpen[c]) { 
      c++;
      return;
    }
    arrListenerOpen.push(btn);  
    btn.addEventListener('click', function () {
      let countAttr = Number(this.getAttribute('data-count'));
      lists.forEach(list => { 
        inputName.forEach(item => { 
          let countAttrInput = Number(this.getAttribute('data-count'));
          if (list.id === countAttr && list.id === countAttrInput) {
            list.name = item.value;
            let titleElem = list.name;
            let data = list.data;
            openList(titleElem, data, countAttr, list)//;
          }
        })
       
      }) 
    })
  })
  //УДАЛИТЬ - проверка, есть ли на кнопке уже слушатель.
  btnClickDel.forEach(btn => { 
    if (btn === arrListenerDel[c1]) { 
      c1++;
      return;
    }
    arrListenerDel.push(btn);
    btn.addEventListener('click', function () {
      let countAttr = Number(this.getAttribute('data-count'));
      lists.forEach(list => { 
        if (list.id === countAttr) { 
          let objName = list.name; 
          let parent = btn.parentElement; 
          let obj = list;
          delList(obj, objName, parent);
        }
      })
    })
  })
  //Клик на инпуты
//----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  //Функция открытия списка (рендер шаблона, рендер существующих пунктов)
  function openList(name, data, countAttr, list) { 
    let x =
            `<div class = "main_for_child">
              <div class = "title_main_list">
              <h2>${name}</h2>
              <button class = "close_hidden" data-count = "${countAttr}">X</button>
            </div>
            <input class = "INPT_main" placeholder = "Введите задачу" />
            <button class = "addbtn_main" data-count = "${countAttr}">Ввод </button>
            <ul class = "list"></ul>
            `;
    main.innerHTML = x;

    //Проверка, есть ли в data пункты меню
    let ul = document.querySelector('.list');
    data.forEach(item => {
      renderPoint(item.name, item, list);
    })
    //Ловим кнопку добавления пунктов и передаем в функцию  
    let btnClickOpen = document.querySelector('.addbtn_main');
    addPoint(btnClickOpen);

    //Ловим кнопку закрытия списка
    let closeBtn = document.querySelector('.close_hidden');
    closeList(closeBtn);
  }

  //Функция добавления задач в объект
  function addPoint(btn) { 

    lists.forEach(list => { 
      btn.addEventListener('click', function () {
        let b = Number(this.getAttribute('data-count'));
        if (b === list.id) { 
          let inputMainValue = document.querySelector('.INPT_main').value;
          if (inputMainValue === "") { 
            return;
          }
          document.querySelector('.INPT_main').value = "";
          let objData = {
            name: inputMainValue,
            id: list.id,
            checked: false,
          }
          list.data.push(objData);
          let pointValue = list.data[list.data.length - 1].name; // значение пункта
          let flag = list.data[list.data.length - 1].checked; //флаг пункта

          renderPoint(pointValue, objData, list);
        }
      })
    })
  }

  //Рендер пункта меню
  function renderPoint(point, objData, list) {
    if (objData.checked === true) {
      let ul = document.querySelector('.list');
      let li = document.createElement('li');
      li.className = 'point';
      li.innerHTML = point[0].toUpperCase() + point.slice(1);
      let delBtn = document.createElement('button');
      delBtn.className = 'delBtn';
      delBtn.innerHTML = 'X';
          
      li.append(delBtn);
      ul.prepend(li);

      li.classList.toggle("comply");

      //зачеркнуть пункт или нет 
      li.addEventListener('click', function () { 
        if (li.className === "point") {
          li.classList.toggle("comply");
          objData.checked = true;
        }
        else if (li.className === "point comply") { 
          li.classList.toggle("comply"); 
          objData.checked = false;
        }
      })
      //удаление пунктов
      delBtn.addEventListener('click', function () {
        list.data.forEach(item => { 
          if (point === item.name) { 
            li.remove();
            let idx = list.data.findIndex(data => data.name === point);
            list.data.splice(idx, 1);
          }
        })
      })

    } else { 
      let ul = document.querySelector('.list');
      let li = document.createElement('li');
      li.className = 'point';
      li.innerHTML = point[0].toUpperCase() + point.slice(1);
      let delBtn = document.createElement('button');
      delBtn.className = 'delBtn';

      delBtn.innerHTML = 'X';
          
      li.append(delBtn);
      ul.prepend(li);

      //зачеркнуть пункт или нет 
     li.addEventListener('click', function () { 
      if (li.className === "point") {
        li.classList.toggle("comply");
        objData.checked = true;
      }
      else if (li.className === "point comply" ) { 
        li.classList.toggle("comply"); 
        objData.checked = false;
      }
     })
      //удаление пунктов
      delBtn.addEventListener('click', function () {
        list.data.forEach(item => { 
          if (point === item.name ) { 
            li.remove();
            let idx = list.data.findIndex(data => data.name === point);
            list.data.splice(idx, 1);
          }
        })
      })
    }
  }

  //Функция закрытия списка
  function closeList(btn) {
    let mainForCh = document.querySelector('.main_for_child');
    lists.forEach(list => {
      btn.addEventListener('click', function () {
        let b = Number(this.getAttribute('data-count'));
        if (b === list.id) {
          mainForCh.remove();
        }
      })
    })
  }

  //Функция удаления списка
  function delList(obj, objName, parent) {
    let i = 0;
    for (i = 0; i < lists.length; i++) { 
      if (lists[i] === obj) { 
        break;
      }
    }
    parent.remove();
    lists.splice(i, 1); 
    renderLI = [];
    if (main.childNodes.length != 0) { 
      let nameOpen = document.querySelector('.main_for_child h2').innerHTML;
      if (nameOpen === objName) { 
        let mainForCh = document.querySelector('.main_for_child');
        mainForCh.remove();
      }
    }
  }
})