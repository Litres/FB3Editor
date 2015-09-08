/**
 * Контейнер поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.SearchContainer',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.sequence.CustomButton',
			'FBEditor.view.form.desc.sequence.search.name.Name'
		],
		xtype: 'form-desc-sequence-container-search',
		layout: 'anchor',
		flex: 1,
		defaults: {
			width: 465,
			labelWidth: 160,
			labelAlign: 'right'
		},

		/**
		 * @property {FBEditor.view.form.desc.sequence.CustomContainer}
		 */
		customContainer: null,

		translateText: {
			id: 'ID',
			search: 'Поиск'
		},

		initComponent: function ()
		{
			var me = this,
				prefixName = me.prefixName;

			me.hidden = !FBEditor.accessHub;
			me.hidden = FBEditor.desc.Manager.loadingProcess ? true : me.hidden;

			me.items = [
				{
					xtype: 'form-desc-sequence-searchName',
					fieldLabel: me.translateText.search,
					name: prefixName + '-search'
				},
				{
					xtype: 'form-desc-sequence-customBtn',
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

			me.customContainer = me.up('desc-fieldcontainer').down('form-desc-sequence-container-custom');

			btn = me.down('form-desc-sequence-customBtn');
			btn.customContainer = me.customContainer;

			me.callParent(arguments);
		}
	}
);