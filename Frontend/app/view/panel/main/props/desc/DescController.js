/**
 * Контроллер панели свойств описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.DescController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.props.desc',

		/**
		 * Показывает контейнер и скрывает остальные.
		 * @param {Ext.Container} [container] Контенер, который необходимо показать.
		 */
		onShowContainer: function (container)
		{
			var me = this,
				view = me.getView(),
				hideContainerList = view.containerList;

			Ext.Array.each(
				hideContainerList,
				function (id)
				{
					var item,
						visible;

					// контейнер
					item = Ext.getCmp(id);

					visible = container && container.getId && id === container.getId();
					item.setVisible(visible);

					if (!visible && item.cleanContainer)
					{
						// очищаем память контейнера с результатами поиска
						item.cleanContainer();
					}
				}
			);
		}
	}
);