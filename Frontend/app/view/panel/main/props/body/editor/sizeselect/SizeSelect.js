/**
 * Выбор единиц измерений из выпадающего списка и инпут со значением.
 *
 * @author samik3k@gmail.ru <Sokolov Alexander aka Sam3000>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.sizeselect.SizeSelect',
	{
		extend: 'Ext.form.FieldContainer',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.sizeselect.Input',
			'FBEditor.view.panel.main.props.body.editor.sizeselect.Store'
		],
		xtype: 'panel-props-body-editor-sizeselect',
		layout: {
			type: 'hbox',
			pack: 'start',
			align: 'stretch'
		},

		initComponent: function ()
		{
			var me = this,
				store;
			store = Ext.create('FBEditor.view.panel.main.props.body.editor.sizeselect.Store');

			me.items = [
				{
					xtype: 'panel-props-body-editor-sizeselect-input',
					width: 53,
					name: me.name
				},
				{
					xtype: 'combo',
					width: 60,
					name: me.name + '-size',
					store: store,
					queryMode: 'local',
					valueField: 'value',
					displayField: 'text',
					value: 'em',
					editable: false,
					submitValue: false,
					listeners: {
						change: function ()
						{
							this.up('form').fireEvent('change');
						}
					}
				}
			];
			me.callParent(arguments);
		}
	}
);