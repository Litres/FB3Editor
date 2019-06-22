/**
 * Элемент annotation.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.annotation.AnnotationElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.annotation.CreateCommand',
			'FBEditor.editor.element.annotation.AnnotationElementController'
		],

		controllerClass: 'FBEditor.editor.element.annotation.AnnotationElementController',
		htmlTag: 'annotation',
		xmlTag: 'annotation',
		cls: 'el-annotation',
		
		isAnnotation: true,

		createScaffold: function ()
		{
			var me = this,
				factory = FBEditor.editor.Factory,
				els = {};

			els.p = factory.createElement('p');
			els.t = factory.createElementText('Аннотация');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		}
	}
);