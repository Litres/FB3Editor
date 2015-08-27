/**
 * Кнопка для переключения в ручной режим создания связанного объекта.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.CustomButton',
	{
		extend: 'Ext.Button',
		xtype: 'form-desc-relations-object-customBtn',
		text: 'Создать вручную',
		margin: '0 0 0 165px',

		/**
		 * @property {FBEditor.view.form.desc.relations.object.SearchContainer}
		 */
		searchContainer: null,

		/**
		 * @property {FBEditor.view.form.desc.relations.object.CustomContainer}
		 */
		customContainer: null,

		handler: function (btn)
		{
			var me = this;

			me.switchContainers();
		},

		switchContainers: function ()
		{
			var me = this,
				search,
				custom;

			search = me.searchContainer;
			custom = me.customContainer;

			custom.setHidden(false);
			search.setHidden(true);
		}
	}
);