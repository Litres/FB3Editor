/**
 * Контроллер компонента редактора текста для описания..
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.editor.EditorController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.editor',

		/**
		 * Загружает корневой элемент в редактор.
		 * @param {FBEditor.editor.element.root.RootElement} rootElement Корневой элемент.
		 */
		onLoadData: function (rootElement)
		{
			var me = this,
				view = me.getView(),
				editor;

			editor = view.getBodyEditor();
			editor.fireEvent('loadData', rootElement);
		}
	}
);