/**
 * Контейнер данных.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.CustomContainerController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.relations.object.container.custom',

		onAccessHub: function ()
		{
			var me = this,
				view = me.getView(),
				descManager = FBEditor.desc.Manager;

			if (!descManager.isLoadedData())
			{
				// если данные не загружены, то скрываем контейнер данных
				view.setHidden(true);
			}
		}
	}
);