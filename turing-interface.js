var Alphabet = [];
var Columns = [];
//var DataRecordSpec = [];

var getAlphabet = function() {
	for (var i = 0, row = {}; i < Alphabet.length; i++) row[ Alphabet[i] ] = '';
	return row;
}

var setAlphabet = function(abc) {

	Alphabet = abc;

	Ext.apply(Ext.form.VTypes, {
		/*
			/[LlЛл←<]{1}/.test(val[1])
			/[RrПп→>]{1}/.test(val[1])
			/[NnНн—-]{1}/.test(val[1])

			Точка — тоже хороший символ для обозначения отсутствия сдвига.
		 */
		turingcode:  function(val, field) {
			return (new RegExp('^[' + Alphabet.join('') + ']{1}[LlЛл←<RrПп→>NnНн—\-]{1}[0-9]+$')).test(val);
		},
		turingcodeText: 'Правила задаются в формате: wDs<br/> w — записываемый символ (из алфавита машины);<br /> D — сдвиг влево, вправо, или без сдвига (Л,П,Н);<br />s — номер следующего состояния; 0 — завершающее состояние.<br />Примеры: _Л2, 1Н2, xП3, yН0',
		turingcodeMask: new RegExp('[0-9' + Alphabet.join('') + 'LlЛл←<RrПп→>NnНн—\-]'),


		turingabctest: function(val, field) {
			return this.turingabctestMask.test(val);
		},
		turingabctestText: 'Можно использовать только символы из заданного ранее алфавита и символ подчёркивания [_] в&nbsp;качестве указателя пустого места',
		// Такое выражение потенциально небезопасно если в алфавите будут разрешены спец. символы, входящие в регулярные выражения.
		turingabctestMask: new RegExp('^[' + Alphabet.join('') + ']*$', 'i')
	});

	Columns = [
		new Ext.grid.RowNumberer({
			editable: false,
			width: 30
		})
	];
	for (var i = 0; i < Alphabet.length; i++) {
		Columns.push({
			dataIndex: Alphabet[i],
			id:		Alphabet[i],
			header: Alphabet[i]
		});
		/*DataRecordSpec.push(
			{name: Alphabet[i]}
		);*/
	}
}


Ext.apply(Ext.form.VTypes, {
	turingalphaMask: /^[a-zA-Z0-9]*$/,
	turingalphaText: 'Допустимы только латинские буквы и цифры',
	turingalpha: function(val, field) {
		return this.turingalphaMask.test(val);
	}
});

// maskRe VType validation bugfix for Opera
Ext.override(Ext.form.TextField, {
    filterKeys : function(e){
        if(e.ctrlKey){
            return;
        }
        var k = e.getKey();
        if(Ext.isGecko && (e.isNavKeyPress() || k == e.BACKSPACE || (k == e.DELETE && e.button == -1))){
            return;
        }
		//fix→
		if (Ext.isOpera && (k == e.BACKSPACE || k == e.LEFT || k == e.RIGHT || k == e.TAB || k == e.HOME || k == e.END || (k == e.DELETE && e.button == -1) )) {
            return;
        }//fix
        var cc = String.fromCharCode(e.getCharCode());
        if(!Ext.isGecko && e.isSpecialKey() && !cc){
            return;
        }
        if(!this.maskRe.test(cc)){
            e.stopEvent();
        }
    }
});



Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.apply(Ext.QuickTips.getQuickTip(), {
		//trackMouse: true,
		maxWidth: 300,
		minWidth: 150,
		dismissDelay: 0
	});

    var formPanel = new Ext.FormPanel({
        labelWidth: 55,
        frame: true,
		
		id: 'frmSetAlphbet',
        title: 'Тьюринга адова машина',
        bodyStyle: 'padding: 5px 5px 0',
        width: 350,
        defaultType: 'textfield',
		cls: 'frm-set-alphabet',
		monitorValid: true, // Resource cost!
        items: [
			{
                fieldLabel: 'Алфавит',
                name: 'alphabet',
				width: 265,
				vtype: 'turingalpha',
				value: '1',
				listeners: {
					specialkey: function(field, e) {
						if (e.getKey() == e.ENTER) {
							field.ownerCt.getForm().submit();
						}
					}
				},
                allowBlank: false
            }, {
				xtype: 'label',
				cls: 'comment',
				html: 'Задайте алфавит для адовой машины Тьюринга™. Затем будет предложено создать набор правил для&nbsp;этого алфавита и&nbsp;запустить адову машину™. Символ, обозначающий пустое место на ленте (_) входит в алфавит по-умолчанию.'
			}
        ],
        buttons: [{
            text: 'Задать алфавит',
			cls: 'btn-set',
			type: 'submit',
			formBind: true,
			listeners: {
				click: function(el, evt) {
					el.ownerCt.ownerCt.getForm().submit();
				}
			}
        }],
		api: {
			submit: function() {
				var alpha = formPanel.getForm().getValues().alphabet;
				var abc = ['_'];
				// Исключение повторяющихся символов:
				for (var i = 0; i < alpha.length; i++) {
					if (abc.indexOf(alpha[i]) == -1) abc.push(alpha[i]);
				}
				setAlphabet(abc);
				gridWindowRender();
			}
		}
    });

	formPanel.render( Ext.getBody() );
});




var gridWindowRender = function(algo, data) {
	var gridWindow = new Ext.Window({
		title: 'Тьюрингова сатанинская машина™',
		id: 'windowTuringGrid',
		closable: true,
		//closeAction:'hide',
		width: 780,
		height: 500,
		plain: true,
		modal: true,
		layout: 'border',
		listeners: {
			show: function() {
				Ext.getCmp('frmSetAlphbet').disable();
				Ext.getCmp('frmSetAlphbet').hide();
				
				Ext.getCmp('frmExamples').hide();
			},
			close: function() {
				Ext.getCmp('frmSetAlphbet').enable();
				Ext.getCmp('frmSetAlphbet').show();

				Ext.getCmp('frmExamples').show();
			},
			hide: function() {
				Ext.getCmp('frmSetAlphbet').enable();
				Ext.getCmp('frmSetAlphbet').show();

				Ext.getCmp('frmExamples').show();
			}
		},
		items: [
			new Ext.Panel({
				region: 'south',
				deferredRender: false,
				bodyBorder: false,
				frame: true,
				height: 'auto',
				title: 'Лента',
				bodyStyle: 'padding: 5px',
				items: [{
					xtype: 'textfield',
					name: 'input',
					value: data || String.leftPad('_', 3, Alphabet[1]) + Alphabet[1],
					width: '98%',
					id: 'inputTape',
					vtype: 'turingabctest',
					listeners: {
						specialkey: function(field, e) {
							if (e.getKey() == e.ENTER) {
							}
						}
					},
					allowBlank: false
				}, {
					xtype: 'label',
					cls: 'comment',
					html: 'Начальное состояние ленты.'
				}]
			}),

			new Ext.Panel({
				region: 'east',
				layout: {
					type:'vbox',
					padding: '3 0 3 3',
					align:'stretch'
				},

				deferredRender: false,
				title: 'Лог выполнения',
				iconCls: 'icon-appconsole',
				width: 200,
				minSize: 100,
				maxSize: 600,

				collapsible: true,
				split: true,
				border: true,
				bodyBorder: false,

				cmargins: '0 0 0 5',

				items: [{
					//xtype: 'textarea',
					xtype: 'label',
					cls: 'output',
					id: 'textOutput',
                    flex: 10,
					autoScroll: true,
					
					name: 'output'
				}]
			}),		
			new Ext.grid.EditorGridPanel({
				region: 'center',
				
				ref: 'gridAlgo',
				//bufferResize: true, // Resource cost!
				border: true,
				bodyBorder: false,

				clicksToEdit: 1,
 				enableColumnHide: false,
 				//enableColumnResize: false, // Column move will not work if this disabled!
				enableHdMenu: false,
				forceValidation: true, // Resource cost!
				id: 'gridTuringCode',
				cm: new Ext.grid.ColumnModel({
					defaults: {
						sortable: false,
						resizable: false,
						width: 50,
						//menuDisabled: true,
						editor: {
							xtype: 'textfield',
							vtype: 'turingcode'
						}
					},
					columns: Columns
				}),
				sm: new Ext.grid.RowSelectionModel({
					listeners: {
						selectionchange: function() {
							var grid = Ext.getCmp('gridTuringCode');
							//var grid = gridWindowRender;
							grid.btnRemove.setDisabled(grid.getSelectionModel().getCount() < 1);
						}
					},
					singleSelect: true
				}),
				view: new Ext.grid.GridView({
					markDirty: false
				}),
				store: new Ext.data.ArrayStore({
					fields: Alphabet,
					autoDestroy: true,
					autoSave: true,
					data: [ Ext.data.Record.create(Alphabet) ],
					/*
					refreshData: function() {
					},
					listeners: {
						add: function(store, rec, index) {
							store.refreshData();
						},
						update: function(store, rec, op) {
							store.refreshData();
						},
						remove: function(store, rec, index) {
							store.refreshData();
						}
					}
					*/
				}),
				tbar: [{
					text: 'Добавить состояние',
					iconCls: 'btn-add',
					ref: '../btnAdd',
					handler : function(el, evt) {
						// var grid = Ext.getCmp('gridTuringCode');
						var grid = el.ownerCt.ownerCt;
						grid.stopEditing();

						var total = grid.getStore().getCount();

						var Rec = grid.getStore().recordType;
						var row = new Rec();

		                grid.getStore().insert( total, row );

				        grid.getView().refresh();
						grid.getSelectionModel().selectRow(total);
						grid.startEditing(total, 1);
						
						//grid.getStore().save();

					}
				}, {
					ref: '../btnRemove',
					iconCls: 'btn-remove',
					text: 'Удалить',
					disabled: true,
					handler: function(el, evt) {
						var grid = el.ownerCt.ownerCt;
						grid.stopEditing();
						var s = grid.getSelectionModel().getSelections();
						for(var i = 0, r; r = s[i]; i++){
							grid.getStore().remove(r);
						}
					}
				}, {
					text: 'Выполнить',
					iconCls: 'btn-go',

					handler : function(el, evt) {
						var grid = el.ownerCt.ownerCt;
						grid.stopEditing();

						var left  = /[LlЛл←<]{1}/;
						var right = /[RrПп→>]{1}/;
						var none  = /[NnНн—-]{1}/;

						var insuctions = [];
						var isWayOutExists = false;
						grid.getStore().each(function(r) {
							var state = {};

							for (var k in r.data) {
								if (r.data[k]) {							
									var cmd = r.data[k].split('', 2);
									cmd.push(
										parseInt( r.data[k].substr(2) )
									);
									if (cmd[2] == 0) isWayOutExists = true;
									if ( left.test(cmd[1]) ) cmd[1] = -1;
									else if ( right.test(cmd[1]) ) cmd[1] = 1;
									else cmd[1] = 0;
									state[k] = cmd;
								} else {
									state[k] = false;
								}
							}
							insuctions.push(state);
						});

						var data = Ext.getCmp('inputTape').getValue();

						//console.debug( Ext.encode(insuctions) );

						if (!isWayOutExists) return alert('Не задана точка выхода! В наборе состояний должен быть указан переход в завершающее состояние — 0.')

						var out = Ext.getCmp('textOutput');
						out.setText('', false);
						var callback = function(data, pos, state) {
							out.setText(
								out.html + '<br />' +
								data.substr(0, pos) + '<b>' + data.substr(pos, 1) + '</b>' + data.substr(pos + 1) + ' →' + state,
								false
							);
						}

						try {
							var result = runMachine(insuctions, data, callback);
							out.setText(out.html + '<br /><br />' + result, false);
						} catch(e) {
							alert(e);
						}
						//console.debug(result);
					}
				}]
			})
		]
	});

	if (algo) gridWindow.gridAlgo.getStore().loadData(algo);

	gridWindow.show();
}
