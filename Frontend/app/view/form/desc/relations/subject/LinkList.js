/**
 * Список возможных типов связей для персоны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.LinkList',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.form.desc.relations.subject.LinkStore'
		],
		xtype: 'form-desc-relations-subject-link-list',
		name: 'relations-subject-link-list',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'value',
		editable: false,
		forceSelection: true,
		listeners: {
			change: function ()
			{
				this.ownerCt.fireEvent('changeList');
			}
		},

		initComponent: function ()
		{
			var me = this,
				store;

			store = Ext.create('FBEditor.view.form.desc.relations.subject.LinkStore');
			me.store = store;
			me.callParent(arguments);
		}
	}
);