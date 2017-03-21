/**
 * Тулбар для редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.toolbar.Toolbar',
	{
		extend: 'FBEditor.editor.view.toolbar.Toolbar',
		requires: [
			'FBEditor.view.panel.main.editor.button.a.A',
			'FBEditor.view.panel.main.editor.button.annotation.Annotation',
			'FBEditor.view.panel.main.editor.button.blockquote.Blockquote',
			'FBEditor.view.panel.main.editor.button.code.Code',
			'FBEditor.view.panel.main.editor.button.div.Div',
			'FBEditor.view.panel.main.editor.button.em.Em',
			'FBEditor.view.panel.main.editor.button.epigraph.Epigraph',
			'FBEditor.view.panel.main.editor.button.img.Img',
			'FBEditor.view.panel.main.editor.button.note.Note',
			'FBEditor.view.panel.main.editor.button.notebody.Notebody',
			'FBEditor.view.panel.main.editor.button.notes.Notes',
			'FBEditor.view.panel.main.editor.button.ol.Ol',
			'FBEditor.view.panel.main.editor.button.poem.Poem',
			'FBEditor.view.panel.main.editor.button.pre.Pre',
			'FBEditor.view.panel.main.editor.button.section.Section',
			'FBEditor.view.panel.main.editor.button.spacing.Spacing',
			'FBEditor.view.panel.main.editor.button.span.Span',
			'FBEditor.view.panel.main.editor.button.strikethrough.Strikethrough',
			'FBEditor.view.panel.main.editor.button.strong.Strong',
			'FBEditor.view.panel.main.editor.button.sub.Sub',
			'FBEditor.view.panel.main.editor.button.subscription.Subscription',
			'FBEditor.view.panel.main.editor.button.subtitle.Subtitle',
			'FBEditor.view.panel.main.editor.button.sup.Sup',
			'FBEditor.view.panel.main.editor.button.table.Table',
			'FBEditor.view.panel.main.editor.button.title.Title',
			'FBEditor.view.panel.main.editor.button.titlebody.TitleBody',
			'FBEditor.view.panel.main.editor.button.ul.Ul',
			'FBEditor.view.panel.main.editor.button.underline.Underline'
		],

		xtype: 'main-editor-toolbar',

		items: [
			{
				xtype: 'main-editor-button-notes'
			},
			{
				xtype: 'main-editor-button-notebody'
			},
			{
				xtype: 'tbspacer',
				width: 20
			},
			{
				xtype: 'main-editor-button-titlebody'
			},
			{
				xtype: 'main-editor-button-section'
			},
			{
				xtype: 'tbspacer',
				width: 20
			},
			{
				xtype: 'main-editor-button-title'
			},
			{
				xtype: 'main-editor-button-epigraph'
			},
			{
				xtype: 'main-editor-button-annotation'
			},
			{
				xtype: 'main-editor-button-subscription'
			},
			{
				xtype: 'tbspacer',
				width: 20
			},
			{
				xtype: 'main-editor-button-div'
			},
			{
				xtype: 'main-editor-button-subtitle'
			},
			{
				xtype: 'main-editor-button-blockquote'
			},
			{
				xtype: 'main-editor-button-pre'
			},
			{
				xtype: 'main-editor-button-poem'
			},
			{
				xtype: 'main-editor-button-ul'
			},
			{
				xtype: 'main-editor-button-ol'
			},
			{
				xtype: 'tbspacer',
				width: 20
			},
			{
				xtype: 'main-editor-button-table'
			},
			{
				xtype: 'tbspacer',
				width: 20
			},
			{
				xtype: 'main-editor-button-img'
			},
			{
				xtype: 'main-editor-button-a'
			},
			{
				xtype: 'main-editor-button-note'
			},
			{
				xtype: 'tbspacer',
				width: 20
			},
			{
				xtype: 'main-editor-button-strong'
			},
			{
				xtype: 'main-editor-button-em'
			},
			{
				xtype: 'main-editor-button-underline'
			},
			{
				xtype: 'main-editor-button-strikethrough'
			},
			{
				xtype: 'main-editor-button-spacing'
			},
			{
				xtype: 'main-editor-button-sub'
			},
			{
				xtype: 'main-editor-button-sup'
			},
			{
				xtype: 'main-editor-button-code'
			},
			{
				xtype: 'main-editor-button-span'
			},
			{
				xtype: 'tbspacer',
				width: 20
			},
			{
				xtype: 'editor-toggleButton'
			}
		],

		createButtons: function ()
		{
			var me = this;

			me.buttons = [
				me.down('main-editor-button-notes'),
				me.down('main-editor-button-notebody'),
				me.down('main-editor-button-titlebody'),
				me.down('main-editor-button-section'),
				me.down('#main-editor-button-title'),
				me.down('main-editor-button-epigraph'),
				me.down('main-editor-button-annotation'),
				me.down('main-editor-button-subscription'),
				{
					sequence: [
						me.down('main-editor-button-div'),
						me.down('main-editor-button-subtitle'),
						me.down('main-editor-button-blockquote'),
						me.down('main-editor-button-pre'),
						me.down('main-editor-button-poem')
					]
				},
				me.down('main-editor-button-ul'),
				me.down('main-editor-button-ol'),
				me.down('main-editor-button-table'),
				me.down('main-editor-button-img'),
				me.down('main-editor-button-a'),
				me.down('main-editor-button-note'),
				me.down('main-editor-button-strong'),
				me.down('main-editor-button-em'),
				me.down('main-editor-button-underline'),
				me.down('main-editor-button-strikethrough'),
				me.down('main-editor-button-spacing'),
				me.down('main-editor-button-sub'),
				me.down('main-editor-button-sup'),
				me.down('main-editor-button-code'),
				me.down('main-editor-button-span')
			];
		},

		getButton: function (name)
		{
			var me = this,
				btn,
				xtype;

			xtype = 'main-editor-button-' + name;
			btn = me.down(xtype);

			return btn;
		}
	}
);