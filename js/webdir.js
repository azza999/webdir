const save = (data,key) => localStorage.setItem(key,JSON.stringify(data));
const load = key => JSON.parse(localStorage.getItem(key));

const $dirList = $('#dirList');

const $nowDir = $('.dir-path-now');
const $contextMenu = $('.contextMenu');

const getLocationFromURL = ()=>(new URL(location.href).searchParams.get('location')) || '/';

let nowDir = getLocationFromURL();
let prevDir = nowDir;

// ajax post (actions)

const changeDir = newDir => {
	newDir = newDir.replace('//','/');
	Loading.start();
	if (nowDir == newDir) {
		nowDir = newDir;
		history.replaceState({page: 'webdir'},'webdir','/WebDir/index.html?location='+newDir);
		console.log('replace');
	} else {
		nowDir = newDir;
		history.pushState({page: 'webdir'},'webdir','/WebDir/index.html?location='+newDir);
		console.log('push');
	}
	changeList();
}

$(window).on('popstate',function(e) {
	console.log(e);
	changeList();
})

function changeList() {
	$.post('./functions/getDirInner.php',{dir: getLocationFromURL()},(data)=>{ // data : html
		Loading.stop();
		$nowDir.text(getLocationFromURL());
		$dirList.html('<div class="dirBack"></div>' + data);
		$('.dirBack').css({height: $dirList.get(0).scrollHeight+'px'});
	});
}

const openFile = (dir,name) => {
	Loading.start();
	$.post('./functions/openFile.php',{dir: dir},(data)=>{
		Loading.stop();
		TextEditor.open(data,name);
	});
	changeDir(nowDir);
}

const deleteFile = (dir,name) => {
	Loading.start();
	$.post('./functions/deleteFile.php',{dir: dir},(data)=>{
		Loading.stop();
		console.log(data);
		if (data) {
			changeDir(nowDir);
			return;
		}
		if(confirm('폴더 안에 파일이 존재합니다. 정말 삭제하시겠습니까?')) {
			$.post('./functions/deleteFolder.php',{dir:dir},(data)=>{
				console.log(data);
				changeDir(nowDir);
			})
		}
	});
}

const saveFile = (dir,val) => {
	Loading.start();
	$.post('./functions/saveFile.php',{dir: dir, content: val}, function(data) {
		Loading.stop();
		console.log(data);
	});
}
const addFile = dir => {
	Prompt.open('파일생성','파일명','생성하기',(name)=>{
		$.post('./functions/addFile.php',{dir: nowDir+'/'+name},data=>{
			console.log(data);
			if (!data) {
				alert('파일 생성에 실패했습니다');
			}
			changeDir(nowDir);
		});
	});
}
const addFolder = dir => {
	Prompt.open('폴더생성','폴더명','생성하기',(name)=>{
		$.post('./functions/addFolder.php',{dir: nowDir+'/'+name},data=>{
			console.log(data);
			if (!data) {
				alert('폴더 생성에 실패했습니다')
			}
			changeDir(nowDir);
		})
	});
}

const downloadFile = (dir, name) => {
	const form = document.createElement('form');
	form.action = './functions/downloadFile.php';
	form.method = 'post';
	form.click();
	const dirInput = document.createElement('input');
	dirInput.value = dir;
	dirInput.name = 'dir';
	const nameInput = document.createElement('input');
	nameInput.value = name;
	nameInput.name = 'name';
	form.appendChild(dirInput);
	form.appendChild(nameInput);
	form.style.display = 'none';
	document.body.appendChild(form);
	console.log(dir,name);
	form.submit();
}

// 전역객체

const Loading = {
	$Loading: $('#loading'),
	$LoadingText: $('.loading-text'),
	$LoadingIcon: $('.loading-icon'),
	start: function() {
		return this.$Loading.css({opacity: 1});
	},
	stop: function() {
		return this.$Loading.css({opacity: 0});
	}
}

const Modal = {
	$modal: $('.modal'),
	open: function() {
		this.$modal.css({visibility: 'visible', opacity: 1});
	},
	close: function() {
		this.$modal.css({visibility: 'hidden', opacity: 0});
	}
}

const TextEditor = {
	cache: {},
	$textEditor: $('#textEditor'),
	$title: $('.textEditor-title'),
	$textarea: $('.textEditor-textarea'),
	$cancelBtn: $('.textEditor-cancel'),
	$saveBtn: $('.textEditor-save'),
	open: function(data,name) {
		TextEditor.viewContents(data);
		TextEditor.setTitle(name);
		TextEditor.cache.dir = nowDir+'/'+name;
		Modal.open();
		TextEditor.$textEditor.css({visibility: 'visible', opacity: 1});
	},
	viewContents: data => TextEditor.$textarea.val(data),
	setTitle: title => TextEditor.$title.text(title),
	close: function() {
		Modal.close();
		TextEditor.$textEditor.css({visibility: 'hidden', opacity: 0});
		console.log(TextEditor.$textEditor);
	},
	initEvent: function() {
		TextEditor.$cancelBtn.on('click',e=>{
			this.close();
		})
		TextEditor.$saveBtn.on('click',e=>{
			saveFile(TextEditor.cache.dir,TextEditor.$textarea.val());
			this.close();
		})
		$(window).on('keydown',e=>{
			if (e.keyCode == 27) {
				TextEditor.close();
			}
		})
	},
	unbindEvent: function() {
		this.$cancelBtn.unbind('click');
	},
}

const Prompt = {
	cache: {},
	$prompt: $('#prompt'),
	$title: $('.prompt-title'),
	$name: $('.prompt-name'),
	$input: $('.prompt-input'),
	$cancelBtn: $('.prompt-cancel'),
	$okBtn: $('.prompt-ok'),
	initEvent: function() {
		this.$cancelBtn.on('click',e=>{
			this.cancel();
		});
		this.$okBtn.on('click',e=>{
			this.ok();
		});
	},
	open: function(title,name,oktext,action) {
		this.cache.action = action;
		Modal.open();
		this.$prompt.css({visibility: 'visible', opacity: 1});
		this.$title.text(title);
		this.$name.text(name);
		this.$okBtn.text(oktext);
	},
	close: function() {
		Modal.close();
		this.$prompt.css({visibility: 'hidden', opacity: 0});
	},
	cancel: function() {
		this.close();
	},
	ok: function() {
		this.cache.action(this.$input.val());
		this.close();
	},
}

const ContextMenu = {
	cache: {},
	$contextMenu: $('.contextMenu'),
	$downloadBtn: $('.contextMenu-download'),
	$deleteBtn: $('.contextMenu-delete'),
	$addFile: $('.contextMenu-file'),
	$addFolder: $('.contextMenu-folder'),
	open: function(e) {
		if (this.cache.type === undefined) {
			this.$downloadBtn.css({display: 'none'});
			this.$deleteBtn.css({display: 'none'});
		} else {
			this.$downloadBtn.css({display: 'block'});
			this.$deleteBtn.css({display: 'block'});
		}
		$contextMenu.css({
			display: 'inline-block',
			left: e.pageX,
			top: e.pageY
		});
	},
	close: function() {
		$contextMenu.css({
			display: 'none'
		})
	},
	initEvent: function() {
		$(document).on('click.contextMenu',e=>{
			this.close();
		})
		this.$downloadBtn.on('click',e=>{
			if(this.cache.type == 'folder') { alert('폴더는 다운로드할 수 없습니다!'); return; }
			downloadFile(this.cache.dir,this.cache.name);
		})
		this.$deleteBtn.on('click',e=>{
			deleteFile(this.cache.dir,this.cache.name);
		})
		this.$addFile.on('click',e=>{
			addFile(nowDir);
		})
		this.$addFolder.on('click',e=>{
			addFolder(nowDir);
		})
		$(window).on('keydown',e=>{
			if (e.keyCode == 27) {
				this.close();
			}
		})
	},
}

$dirList.on('dblclick','[data-type="folder"]',e=>{
	changeDir(e.currentTarget.dataset['target']);
});
$dirList.on('dblclick','[data-type="file"]',e=>{
	openFile(e.currentTarget.dataset['target'],e.currentTarget.dataset['name']);
});
$dirList.on('contextmenu','[data-type="folder"],[data-type="file"],.dirBack',e=>{
	e.preventDefault();
	if (e.button == 2) {
		ContextMenu.cache.type = $(e.currentTarget).data('type');
		ContextMenu.cache.dir = $(e.currentTarget).data('target');
		ContextMenu.cache.name = $(e.currentTarget).data('name');
		ContextMenu.open(e);
	}
});

//download

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  window.addEventListener(eventName, e=>e.preventDefault());
})

window.addEventListener('drop', e=>{
	console.log(e.dataTransfer.files);
	let files = e.dataTransfer.files;

	let formData = new FormData();
	formData.append('dir',nowDir);

	for (var i = 0; i < files.length; i++) {
		formData.append('files'+i,files[i],files[i].name);
	}
	$.ajax({
		url: './uploadFile.php',
		data: formData,
		type: "POST",
		processData: false,
		contentType: false,
		success: function(data) {
			console.log(data);
			changeDir(nowDir);
		}
	});
});

function chk_pw() {
	let id = $('#id').val();
	let pw = $('#pw').val();
	$.post('check_pw.php',{id:id,pw:pw},(result)=>{
		console.log(result);
		if (result == 1) {
			$('.pwchkModal').css({
				visibility: 'hidden',
				opacity: 0
			})
			$(window).unbind('keydown.pwchkModal');
			changeList(nowDir);
		} else {
			alert('아이디나 비밀번호가 잘못되었습니다!');
		}
	});
}

$(document).ready(e=>{
	TextEditor.initEvent();
	Prompt.initEvent();
	ContextMenu.initEvent();
	$(window).on('keydown.pwchkModal',e=>{
		if(e.keyCode == 13) chk_pw();
	})
	$('.pwchkModal-btn').on('click.pwchkModal',e=>{
		chk_pw();
	});
})