/**
 * Конртоллер переключателя.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.custom.viewer.switcher.SwitcherController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.form.desc.relations.subject.custom.viewer.switcher',

		/**
		 * @event showEditor
		 */
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				customContainer = view.getCustomContainer(),
				stateCmp;

			// переключаем состояние
			view.toggle();

			stateCmp = view.getStateCmp();

			// показываем или скрываем редактируемые поля
			customContainer.fireEvent('showEditor', stateCmp);
		}
	}
);