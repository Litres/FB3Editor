/**
 * Кнопка вставки аннотации annotation.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.annotation.Annotation',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.annotation.AnnotationController'
		],

		xtype: 'main-editor-button-annotation',
		controller: 'main.editor.button.annotation',

		//html: '<i class="fa fa-font"></i>',
		text: '+ Аннотация',

		tooltipText: 'Аннотация',
		elementName: 'annotation'
	}
);