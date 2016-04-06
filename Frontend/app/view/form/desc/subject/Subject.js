/**
 * Список жанров/тегов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.Subject',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.subject.SubjectController',
			'FBEditor.view.form.desc.subject.SubjectTree',
			'FBEditor.view.form.desc.subject.field.SubjectField',
		    'FBEditor.view.form.desc.subject.tag.Window'
		],
		xtype: 'form-desc-subject',
		controller: 'form.desc.subject',
		layout: 'hbox',
		plugins: {
			ptype: 'fieldcontainerreplicator',
			groupName: 'classification-subject',
			btnStyle: {
				margin: '0 0 0 5px'
			}
		},

		listeners: {
			selectSubject: 'onSelectSubject',
			selectTag: 'onSelectTag',
			showSubjectTree: 'onShowSubjectTree',
			showTag: 'onShowTag'
		},

		translateText: {
			subject: 'Жанр',
			tag: 'Тег',
			undefined: 'Жанр/Тег'
		},

		/**
		 * @property {FBEditor.view.form.desc.subject.SubjectTree} Дерево жанров.
		 */
		subjectTree: null,

		/**
		 * @property {FBEditor.view.form.desc.subject.tag.Window} Список тегов.
		 */
		tag: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'form-desc-subject-field',
					flex: 1,
					fieldLabel: me.translateText.undefined,
					labelAlign: 'right',
					labelWidth: 110,
					keyEnterAsTab: true
				}
			];

			me.callParent(arguments);
		},

		getSubjectTree: function ()
		{
			var me = this,
				subjectTree;

			subjectTree  = me.subjectTree || Ext.getCmp('form-desc-subjectTree') || Ext.widget('form-desc-subjectTree');
			me.subjectTree = subjectTree;

			return subjectTree;
		},

		getTag: function ()
		{
			var me = this,
				tag;

			tag  = me.tag || Ext.getCmp('form-desc-tag') || Ext.widget('form-desc-tag');
			me.tag = tag;

			return tag;
		}
	}
);