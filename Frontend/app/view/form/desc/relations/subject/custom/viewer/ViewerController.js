/**
 * Контроллер контейнера отображающего краткую сводку данных.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.custom.viewer.ViewerController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',

		alias: 'controller.form.desc.relations.subject.custom.viewer',

		/**
		 * Устанавливает Стандартное написание.
		 * @param {String} val Значение.
		 */
		onSetTitle: function (val)
		{
			var me = this,
				view = me.getView(),
				title = view.getTitle();

			title.setValue(val);
		},

		/**
		 * Устанавливает Тип связи.
		 * @param {String} val Значение.
		 */
		onSetLink: function (val)
		{
			var me = this,
				view = me.getView(),
				link = view.getLink();

			link.setValue(val);
		}
	}
);