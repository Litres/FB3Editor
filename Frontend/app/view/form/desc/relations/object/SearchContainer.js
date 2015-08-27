/**
 * Контейнер поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.SearchContainer',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.store.desc.relations.Object',
			'FBEditor.view.form.desc.relations.object.CustomButton',
			'FBEditor.view.form.desc.relations.object.search.name.Name',
			'FBEditor.view.form.desc.relations.object.search.id.Id'
		],
		xtype: 'form-desc-relations-object-container-search',

		defaults: {
			width: 465,
			labelWidth: 160,
			labelAlign: 'right'
		},

		/**
		 * @property {FBEditor.view.form.desc.relations.object.CustomContainer}
		 */
		customContainer: null,

		translateText: {
			id: 'ID',
			search: 'Поиск'
		},

		initComponent: function ()
		{
			var me = this;

			me.hidden = !FBEditor.accessHub;
			me.hidden = FBEditor.desc.Manager.loadingProcess ? true : me.hidden;

			me.items = [
				{
					xtype: 'form-desc-relations-object-searchId',
					fieldLabel: me.translateText.id,
					name: 'relations-object-search',
					regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}|[0-9]{2,}$/
				},
				{
					xtype: 'form-desc-relations-object-searchName',
					fieldLabel: me.translateText.search,
					name: 'relations-object-search'
				},
				{
					xtype: 'form-desc-relations-object-customBtn',
					width: 300,
					searchContainer: me
				}
			];

			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this,
				btn;

			// сохраняем ссылку на контейнер полей данных

			me.customContainer = me.up('desc-fieldcontainer').down('form-desc-relations-object-container-custom');

			btn = me.down('form-desc-relations-object-customBtn');
			btn.customContainer = me.customContainer;

			me.callParent(arguments);
		}
	}
);