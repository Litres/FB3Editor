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
				)
			};

			me.items = [
				{
					name: 'id',
					fieldLabel: 'ID',
					anchor: '100%'
				},
				{
					name: 'width',
					labelAlign: 'left',
					fieldLabel: me.translateText.width,
					regex: /^\d+(\.\d+)?(em|ex|%|mm)$/,
					regexText: me.translateText.widthError,
					style: {
						marginTop: '15px'
					}
				},
				{
					name: 'min-width',
					labelAlign: 'left',
					fieldLabel: me.translateText.minWidth,
					regex: /^\d+(\.\d+)?(em|ex|%|mm)$/,
					regexText: me.translateText.widthError
				},
				{
					name: 'max-width',
					labelAlign: 'left',
					fieldLabel: me.translateText.maxWidth,
					regex: /^\d+(\.\d+)?(em|ex|%|mm)$/,
					regexText: me.translateText.widthError
				},
				{
					xtype: 'combo',
					name: 'float',
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
					name: 'align',
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
					name: 'border',
					labelAlign: 'left',
					fieldLabel: me.translateText.border,
					inputValue: 'true'
				},
				{
					xtype: 'checkbox',
					name: 'on-one-page',
					labelAlign: 'left',
					fieldLabel: me.translateText.onOnePage,
					inputValue: 'true'
				},
				{
					name: 'bindto',
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