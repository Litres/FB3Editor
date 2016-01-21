/**
 * Определяет поведение родительского контейнера c результатами поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.container.desc.search.OwnerContainerBehavior',
	{
		/**
		 * @property {String} xtype контейнера с результатми поиска.
		 */
		xtypeContainerItems: '',

		/**
		 * Удаляет все данные из контейнера.
		 */
		clean: function ()
		{
			var me = this,
				containerItems;

			containerItems = me.getContainerItems();
			containerItems.clean();
		},

		/**
		 * Прерывает поиск.
		 */
		abort: function ()
		{
			var me = this,
				containerItems;

			containerItems = me.getContainerItems();
			containerItems.abort();
		},

		/**
		 * Возвращает контейнер с результатами поиска.
		 * @return {Ext.Container}
		 */
		getContainerItems: function ()
		{
			var me = this,
				containerItems;

			containerItems = me.containerItems || me.down(me.xtypeContainerItems);

			return containerItems;
		}
	}
);