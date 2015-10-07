/**
 * Контроллер поля - Редактор.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.documentInfo.editor.EditorController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.documentInfo.editor',

		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				store = FBEditor.getLocalStorage(),
				val = view.getValue();

			store.setItem('form-desc-documentInfo-editor', val);
		}
	}
);