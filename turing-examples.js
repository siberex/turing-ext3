Ext.onReady(function() {

	var Examples = [
		['Сложение', '_1', [
			['_>1', '1-2'],
			['1>3', '1>2'],
			['_<4', '1>3'],
			['', '_<0']
		], '11111_11'],

		['Умножение', '_1xh', [
			['_>1',  '1-2',     '',     ''],
			['x<3',  '1>2',     '',     ''],
			['_>4',  '1<3',     '',     ''],
			[   '',  '_>5', '_>13',     ''],
			[   '',  '1>5',  'x>6',     ''],
			['x<6',  'h>6',  'x>7',  'h<6'],
			[   '',  '1>7', 'x<11',  '1>8'],
			['1<9',  '1>8',  'x>8',  'h>8'],
			[   '',  '1<9', 'x<10',     ''],
			[   '',  '1>7',     '', 'h<10'],
			[   '', 'h<11', 'x<12',     ''],
			['_>4', '1<12',     '',     ''],
			[   '',     '',  '_<0', '_>13']
		], '11111_11'],

        ['Распознавание чётности', '_1', [
            ['_<3', '1>2'],
            ['_<4', '1>1'],
            ['1-0', '_<3'],
            ['0-0', '_<4']
        ], '1111111111']

	];

    var formExamples = new Ext.FormPanel({
        labelWidth: 65,
        frame: true,

		id: 'frmExamples',
        title: 'Примеры',
        bodyStyle: 'padding: 5px 5px 0',
        width: 350,
        defaultType: 'textfield',
		cls: 'frm-examples',
        items: [{
			xtype: 'combo',
			ref: 'selectAlgo',
			mode: 'local',
			fieldLabel: 'Алгоритм',
			emptyText: 'Выберите пример...',
			width: 255,
    		autoScroll: true,

            allowBlank: false,
			forceSelection: true,
			editable: false,
			autoSelect: false,
			//selectOnFocus: true,
			triggerAction: 'all',

			/*listeners: {
				specialkey: function(field, e) {
					if (e.getKey() == e.ENTER) {
						console.debug( field.isExpanded() );
						//field.ownerCt.getForm().submit();
					}
				}
			},*/

			store: new Ext.data.ArrayStore({
				id: 0,
				fields: [
					'display',
					'alphabet',
					'alg',
					'data'
				],
				data: Examples
			}),
			valueField: 'alg',
			displayField: 'display'
		}, {
			xtype: 'label',
			cls: 'comment',
			html: 'Можно выбрать один из примеров в&nbsp;списке и&nbsp;запустить машину Тьюринга с заданным алгоритмом.'
		}],

        buttons: [{
            text: 'Запустить',
			cls: 'btn-run',
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
				//var form = formExamples.getForm();
				var combo = formExamples.selectAlgo;

				var sel = combo.getStore().getById( combo.getRawValue() );
				sel = sel.data;

				setAlphabet( sel.alphabet.split('') );
				gridWindowRender(sel.alg, sel.data);
			}
		}
    });

	formExamples.selectAlgo.setValue('Сложение');
	formExamples.render( Ext.getBody() );

});

