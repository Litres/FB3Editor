/**
 * Контроллер контейнера с результатами поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.search.ContainerController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.props.desc.search.container',

		onLoadData: function (params)
		{
			var me = this,
				view = me.getView(),
				panelProps = view.getPanelProps(),
				containerItems;

			if (!view.isVisible())
			{
				// показываем контейнер
				panelProps.fireEvent('showContainer', view);
			}

			containerItems = view.getContainerItems();

			// сохраняем параметры запроса для повторных запросов
			containerItems.params = Ext.clone(params);

			containerItems.fireEvent('loadData', params);
		}
	}
);