//region [IMPORT]
var fs = require('fs');
var path = require('path');
var filedialog = require('node-file-dialog');

var open_button = document.getElementById('open_button');
var save_button = document.getElementById('save_button');
var content = document.getElementById('content');
var error_node = document.getElementById('error')
var alert_data_button = document.getElementById('alert_data');

var file;
var data;
//endregion

//region [SCRIPTS]
function register_error(e) {
    error_node.innerText = 'Error! '+e;
}

function clear_error() {
    error_node.innerText = '';
}

open_button.addEventListener('click', ()=>{
    filedialog({type:'open-file'})
        .then((opened_file)=>{
            file = opened_file[0];
            data = JSON.parse(fs.readFileSync(file, {encoding: "utf8"}));
            init_content_window();
        })
        .catch((e)=>{global.console.log(e); register_error(e)});
});

alert_data_button.addEventListener('click', ()=>{
    alert(JSON.stringify(data));
});

function init_content_window() {
    trees = create_tree('dialogues', data['dialogues']);
    content.innerHTML = '';
    content.append(trees);
}

function create_tree(name, content, full_path = '') {
    let element = document.createElement('details');
    let summary = document.createElement('summary');
    summary.innerText = name;
    if (full_path !== '')
    {
        let link_button = document.createElement('button');
        link_button.onclick = ()=>{navigator.clipboard.writeText(full_path)};
        link_button.style['fontSize'] = '0.75rem';
        link_button.style['margin'] = '0 8px';
        link_button.innerText = 'copy path';
        summary.appendChild(link_button);
    }
    let child_div = document.createElement('div');
    child_div.style['padding-left'] = '16px';
    for (let i in content)
    {
        if (content.hasOwnProperty(i))
        {
            if (typeof content[i] === "object" && i !== "choice")
            {
                let new_tree = create_tree(i, content[i], full_path === '' ? i : full_path+'/'+i);
                child_div.appendChild(new_tree);
            }
            else if (typeof content[i] === "string")
            {
                let property_name = document.createElement('div');
                property_name.innerText = i;
                property_name.style['marginRight'] = '12px';
                let property_data = document.createElement('textarea');
                property_data.type = 'text';
                property_data.value = content[i];
                property_data.onchange = ()=>{content[i] = property_data.value;};
                property_data.style['height'] = '1.2rem';
                property_data.style['width'] = '100%';
                property_data.style['fontFamily'] = 'Tahoma, sans-serif';
                let input_field = document.createElement('div');
                input_field.style['display'] = 'flex';
                input_field.style['alignItems'] = 'center'
                input_field.style['padding'] = '4px 0';
                input_field.appendChild(property_name);
                input_field.appendChild(property_data);
                child_div.appendChild(input_field);
            }
        }
    }
    element.appendChild(summary);
    element.appendChild(child_div);
    return element;
}
//endregion

//region [RUN]
nw.Window.get().show();
//endregion