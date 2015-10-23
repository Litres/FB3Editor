/**
 * Контейнер поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.SearchContainer',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.store.desc.relations.Subject',
			'FBEditor.view.form.desc.relations.subject.CustomButton',
			'FBEditor.view.form.desc.relations.subject.search.name.Name'
		],
		xtype: 'form-desc-relations-subject-container-search',

		defaults: {
			width: 465,
			labelWidth: 160,
			labelAlign: 'right'
		},

		/**
		 * @property {FBEditor.view.form.desc.relations.subject.CustomContainer}
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
					xtype: 'form-desc-relations-subject-searchName',
					fieldLabel: me.translateText.search,
					name: 'relations-subject-search'
				},
				{
					xtype: 'form-desc-relations-subject-customBtn',
					cls: 'form-desc-customBtn',
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

			me.customContainer = me.up('desc-fieldcontainer').down('form-desc-relations-subject-container-custom');

			btn = me.down('form-desc-relations-subject-customBtn');
			btn.customContainer = me.customContainer;

			me.callParent(arguments);
		},

		destroy: function ()
		{
			var me = this,
				resultContainer;

			// удаляем окно с результатами описка
			resultContainer = me.down('form-desc-relations-subject-searchName').resultContainer;
			resultContainer.destroy();

			me.callParent(arguments);
		}
	}
);