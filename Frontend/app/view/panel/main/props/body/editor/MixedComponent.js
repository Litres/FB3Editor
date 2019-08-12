/**
 * Содержит общий функционал для компонентов панели.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.MixedComponent',
	{
		/**
		 * Возвращает родительскую панель.
		 * @return {FBEditor.view.panel.main.props.body.editor.AbstractEditor}
		 */
		getPanel: function ()
		{
			return this.up('panel-props-body-editor');
		}
	}
);