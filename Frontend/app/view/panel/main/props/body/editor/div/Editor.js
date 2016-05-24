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
			'FBEditor.view.panel.main.props.body.editor.div.marker.Marker',
			'FBEditor.view.panel.main.props.body.editor.fields.sizeselect.SizeSelect'
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
				)
			};

			me.items = [
				{
					name: me.prefixName + 'id',
					fieldLabel: 'ID',
					anchor: '100%'
				},
				{
					xtype: 'panel-props-body-editor-fields-sizeselect',
					labelAlign: 'left',
					fieldLabel: me.translateText.width,
					name: me.prefixName + 'width'
				},
				{
					xtype: 'panel-props-body-editor-fields-sizeselect',
					labelAlign: 'left',
					fieldLabel: me.translateText.minWidth,
					name: me.prefixName + 'min-width'
				},
				{
					xtype: 'panel-props-body-editor-fields-sizeselect',
					labelAlign: 'left',
					fieldLabel: me.translateText.maxWidth,
					name: me.prefixName + 'max-width'
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