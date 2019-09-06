/**
 * Кнопка вставки блока poem.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.poem.Poem',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.poem.PoemController'
		],
		
		xtype: 'main-editor-button-poem',
		controller: 'main.editor.button.poem',
		
		html: '<i class="fas fa-feather"></i>',

		tooltipText: 'Поэма',
		elementName: 'poem'
	}
);