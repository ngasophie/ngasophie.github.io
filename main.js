window.onload = function(){

    let count = 0;
    let formAdd = document.getElementById('add-task');
    formAdd.onsubmit = function (event) {
        event.preventDefault();
        console.log('ok');
        console.log(123);
        let input = formAdd.task;
        let content = input.value;
        async function validate() {
            if (content != '') {
                input.value = '';
                closeForm();
                    let date = formAdd.date.value;
                    let data = {
                        content: content,
                        date: date
                    }
                    let database = await firebase.firestore().collection('tasks');
                    database.add(data);
                    isFirstRun = true;
                    database.onSnapshot(function(snapshot){
                        snapshot.docChanges().forEach( function(change){
                            if(change.type == 'added'){
                                let list =  document.getElementsByClassName('list')[0];
                                console.log(change.doc);
                                console.log(change.id);
    
                                console.log(change.doc.id);
                                console.log(change.doc.data().content);
                                loadData();
                            }
                        })
                    })
    
                   
            }
            else {
                input.autofocus;
            }
    
        }
        validate();
    
    }
    async function loadData() {
        let data = await firebase.firestore().collection('tasks').get();
        let list =  document.getElementsByClassName('list')[0];
        list.innerHTML = '';
        for (let a of data.docs) {
            console.log(a.data());
            console.log(a.id);
            console.log(a.data().content);
            let html = `
                <div id="due-content-${a.id}" class = "due-content">
                    <div class="due-item">
                        <button id="btn-primary-${a.id}"class ="btn-primary" onclick = "deleteTask('${a.id}')"></button>
                        <div class="due01">${a.data().content}</div><br>
                    </div>
                    <div class="date">${a.data().date}</div>
                </div>
            `;
            list.innerHTML += html;
            document.getElementsByClassName('back')[0].style.display = 'none';
        }
    }
    loadData();
    async function deleteTask(id){
            let del = await firebase.firestore().collection('tasks').doc(id).delete();
            loadData();
    }
    async function search(event){
        event.preventDefault();
        let formSearch =  document.getElementById('search');
        let key =  formSearch.contentSearch.value;
        let data = await firebase.firestore().collection('tasks').get();
        let list =  document.getElementsByClassName('list')[0];
        list.innerHTML = '';
        for(let a of data.docs){
            let nd = a.data().content;
            let index = nd.indexOf(key);
            if( index >=0){
                let html = `
                    <div id="due-content-${a.id}" class = "due-content">
                        <div class="due-item">
                            <button id="btn-primary-${a.id}"class ="btn-primary" onclick = "deleteTask('${a.id}')"></button>
                            <div class="due01">${a.data().content}</div><br>
                        </div>
                        <div class="date">${a.data().date}</div>
                    </div>
                `;
                list.innerHTML += html;
            }
        }
        formSearch.reset();
        document.getElementsByClassName('back')[0].style.display = 'block';
        console.log('ok');
    }
}
function openForm() {
    let element =  document.getElementsByClassName('add-due');
    element[0].style.display = 'none';
    let formAdd =  document.getElementsByClassName('add-task-block')[0];
    formAdd.style.display = "block";
}
 function closeForm(){
    let element =  document.getElementsByClassName('add-due');
    element[0].style.display = 'block';
    let formAdd =  document.getElementsByClassName('add-task-block')[0];
    formAdd.style.display = "none";
}