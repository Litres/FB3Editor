/**
 * Контроллер родительского контейнера каждого отдельного блока о бумажной информации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.item.PublishInfoItemController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',

		alias: 'controller.form.desc.publishInfo.item',

		onLoadInnerData: function (data)
		{
			var me = this,
				view = me.getView(),
				biblio,
				biblioName,
				biblioData;

			biblio = view.getBiblio();
			biblioName = biblio.getName();
			biblioData = data[biblioName];

			if (biblioData)
			{
				// загружаем данные в редактор библиогр. описания
				biblio.loadData(biblioData);
			}
		}
	}
);