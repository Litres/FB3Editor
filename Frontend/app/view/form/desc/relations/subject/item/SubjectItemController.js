/**
 * Контроллер родительского контейнера каждой персоны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.item.SubjectItemController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',

		alias: 'controller.form.desc.relations.subject.item',

		onLoadInnerData: function (data)
		{
			var me = this,
				view = me.getView(),
				btn,
				customContainer,
				searchContainer;

			btn = view.getCustomBtn();

			if (btn)
			{
				// скрываем поля поиска, показываем поля данных

				customContainer = view.getCustomContainer();
				searchContainer = view.getSearchContainer();

				customContainer.setVisible(true);

				customContainer.fireEvent('showViewer', true);
				customContainer.fireEvent('showEditor', false);

				searchContainer.setVisible(false);
			}
		},

		onResetContainer: function ()
		{
			/*var me = this,
				view = me.getView(),
				btn,
				customContainer,
				searchContainer;

			btn = view.getCustomBtn();

			if (btn)
			{
				// скрываем поля поиска, показываем поля данных

				customContainer = view.getCustomContainer();
				searchContainer = view.getSearchContainer();

				customContainer.setVisible(true);

				customContainer.fireEvent('showViewer', true);
				customContainer.fireEvent('showEditor', false);

				searchContainer.setVisible(false);
			}*/
		}
	}
);