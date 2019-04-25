/**
 * Контроллер родительского контейнера каждого объекта.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.item.ObjectItemController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.relations.object.item',

		onAccessHub: function ()
		{
			var me = this,
				view = me.getView(),
				values = view.getValues();
			
			if (!values)
			{
				// показываем поля поиска
				view.switchContainers(true);
			}
			else
			{
				// показываем поля данных
				view.switchContainers();
			}
		},

		/**
		 * Вызывается при сбрасывании данных.
		 */
		onResetContainer: function ()
		{
			var me = this,
				view = me.getView();

			// показываем поля данных
			view.switchContainers();
		}
	}
);