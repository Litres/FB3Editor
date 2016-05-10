/**
 * Панель редактирования элемента div.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.div.Editor',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.div.marker.Marker'
		],
		xtype: 'panel-props-body-editor-div',

		/**
		 * @property {String} Префикс перед именами полей.
		 */
		prefixName: '',

		translateText: {
			width: 'Ширина',
			minWidth: 'Мин. ширина',
			maxWidth: 'Макс. ширина',
			widthError: 'По шаблону \d+(\.\d+)?(em|ex|%|mm). Например: 1.5em',
			floatText: 'Обтекание',
			align: 'Выравнивание',
			bindTo: 'Привязать к',
			border: 'Граница',
			onOnePage: 'on-one-page',
			markerText: 'Маркер'
		},

		initComponent: function ()
		{
			var me = this,
				store;

			store = {
				floatStore: Ext.create(
					'Ext.data.Store',
					{
						fields: ['value', 'text'],
						data : [
							{value: '', text: 'ничего'},
							{value: 'left', text: 'слева'},
							{value: 'right', text: 'справа'},
							{value: 'center', text: 'по центру'},
							{value: 'default', text: 'по умолчанию'}
						]
					}
				),
				alignStore: Ext.create(
					'Ext.data.Store',
					{
						fields: ['text'],
						data : [
							{value: '', text: 'ничего'},
							{value: 'left', text: 'слева'},
							{value: 'right', text: 'справа'},
							{value: 'center', text: 'по центру'},
							{value: 'justify', text: 'по ширине'}
						]
					}
				),
				sizeStore: Ext.create(
					'Ext.data.Store',
					{
						fields: ['value', 'text'],
						data: [
							{ value: 'em', text: 'em' },
							{ value: 'ex', text: 'ex' },
							{ value: '%', text: '%' },
							{ value: 'mm', text: 'mm' }
						]
					}
				)
			};

			me.items = [
				{
					name: me.prefixName + 'id',
					fieldLabel: 'ID',
					anchor: '100%'
				},
				{
					xtype: 'fieldcontainer',
					labelAlign: 'left',
					fieldLabel: me.translateText.width,
					layout: {
						type: 'hbox',
						pack: 'start',
						align: 'stretch'
					},
					defaults: {
						checkChangeBuffer: 200,
						listeners: {
							change: function () {
								this.up('form').fireEvent('change');
							}
						}
					},
					style: {
						marginTop: '15px'
					},
					items: [
						{
							xtype: 'textfield',
							width: 53,
							name: me.prefixName + 'width',
							regex: /^\d+(\.\d+)?/,
							regexText: me.translateText.widthError,
							listeners: {
								blur: function () {
									me.stripWidthInput(this.id);
								},
								change: function () {
									this.up('form').fireEvent('change');
								}
							}
						},
						{
							xtype: 'combo',
							width: 60,
							name: me.prefixName + 'width-size',
							store: store.sizeStore,
							queryMode: 'local',
							valueField: 'value',
							displayField: 'text',
							value: 'em',
							editable: false
						}
					]
				},
				{
					xtype: 'fieldcontainer',
					labelAlign: 'left',
					fieldLabel: me.translateText.minWidth,
					layout: {
						type: 'hbox',
						pack: 'start',
						align: 'stretch'
					},
					defaults: {
						xtype: 'textfield',
						checkChangeBuffer: 200,
						listeners: {
							change: function () {
								this.up('form').fireEvent('change');
							}
						}
					},
					items: [
						{
							xtype: 'textfield',
							width: 53,
							name: me.prefixName + 'min-width',
							regex: /^\d+(\.\d+)?/,
							regexText: me.translateText.widthError,
							listeners: {
								blur: function () {
									me.stripWidthInput(this.id);
								},
								change: function () {
									this.up('form').fireEvent('change');
								}
							}
						},
						{
							xtype: 'combo',
							width: 60,
							name: me.prefixName + 'min-width-size',
							store: store.sizeStore,
							queryMode: 'local',
							valueField: 'value',
							displayField: 'text',
							value: 'em',
							editable: false
						}
					]
				},
				{
					xtype: 'fieldcontainer',
					labelAlign: 'left',
					fieldLabel: me.translateText.maxWidth,
					layout: {
						type: 'hbox',
						pack: 'start',
						align: 'stretch'
					},
					defaults: {
						xtype: 'textfield',
						checkChangeBuffer: 200,
						listeners: {
							change: function () {
								this.up('form').fireEvent('change');
							}
						}
					},
					items: [
						{
							xtype: 'textfield',
							width: 53,
							name: me.prefixName + 'max-width',
							regex: /^\d+(\.\d+)?/,
							regexText: me.translateText.widthError,
							listeners: {
								blur: function () {
									me.stripWidthInput(this.id);
								},
								change: function () {
									this.up('form').fireEvent('change');
								}
							}
						},
						{
							xtype: 'combo',
							width: 60,
							name: me.prefixName + 'max-width-size',
							store: store.sizeStore,
							queryMode: 'local',
							valueField: 'value',
							displayField: 'text',
							value: 'em',
							editable: false
						}
					]
				},
				{
					xtype: 'combo',
					name: me.prefixName + 'float',
					labelAlign: 'left',
					fieldLabel: me.translateText.floatText,
					store: store.floatStore,
					queryMode: 'local',
					valueField: 'value',
					displayField: 'text',
					editable: false
				},
				{
					xtype: 'combo',
					name: me.prefixName + 'align',
					labelAlign: 'left',
					fieldLabel: me.translateText.align,
					store: store.alignStore,
					queryMode: 'local',
					valueField: 'value',
					displayField: 'text',
					editable: false
				},
				{
					xtype: 'checkbox',
					name: me.prefixName + 'border',
					labelAlign: 'left',
					fieldLabel: me.translateText.border,
					inputValue: 'true'
				},
				{
					xtype: 'checkbox',
					name: me.prefixName + 'on-one-page',
					labelAlign: 'left',
					fieldLabel: me.translateText.onOnePage,
					inputValue: 'true'
				},
				{
					name: me.prefixName + 'bindto',
					fieldLabel: me.translateText.bindTo,
					anchor: '100%'
				},
				{
					xtype: 'panel-props-body-editor-marker',
					title: me.translateText.markerText
				}
			];

			me.callParent(arguments);
		},

		stripWidthInput: function (id)
		{
			var me = this;
			var form = me.getForm();
			var field = form.findField(id);
			var fieldValue = field.getValue();
			if (fieldValue == '') {
				return;
			}
			var tmp = fieldValue.match(/^(\d+(\.\d+)?)(em|ex|%|mm)$/);
			if (tmp === null) {
				tmp = fieldValue.match(/^(\d+(\.\d+)?)/);
			} else {
				form.findField(field.getName() + '-size').setValue(tmp[3]);
			}
			if (tmp !== null) {
				field.setValue(tmp[1]);
			}
			// console.log('blur');
		},

		updateData: function (data, isLoad)
		{
			var me = this,
				form = me.getForm(),
				marker;

			me.isLoad = isLoad;
			me.element = data.el ? data.el : me.element;
			form.reset();
			form.setValues(data);
			me.down('panel-props-body-editor-marker').updateData(data, isLoad);
			me.isLoad = false;
		}
	}
);