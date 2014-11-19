/**
 * Список жанров.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.Subject',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.subject.SubjectController',
			'FBEditor.view.form.desc.subject.SubjectTree'
		],
		xtype: 'form-desc-subject',
		controller: 'form.desc.subject',
		layout: 'hbox',
		fieldLabel: 'Жанр',
		plugins: 'fieldcontainerreplicator',
		combineErrors: true,
		msgTarget: 'side',
		listeners: {
			selectSubject: 'onSelectSubject',
			showSubjectTree: 'onShowSubjectTree'
		},

		translateText: {
			select: 'Выбрать'
		},

		/**
		 * @property {FBEditor.view.form.desc.subject.SubjectTree} Список жанров.
		 */
		subjectTree: null,

		initComponent: function ()
		{
			var me = this,
				name = me.name ? me.name : 'subject';

			me.subjectTree = Ext.getCmp('form-desc-subjectTree') || Ext.widget('form-desc-subjectTree');
			me.items = [
				{
					xtype: 'textfield',
					name: name,
					flex: 1,
					allowBlank: false,
					editable: false,
					listeners: {
						click: {
							element: 'el',
							scope: me,
							fn: function ()
							{
								this.fireEvent('showSubjectTree');
							}
						}
					}
				},
				{
					xtype: 'button',
					text: me.translateText.select,
					margin: '0 0 0 2',
					menu: [],
					scope: me,
					handler: function ()
					{
						this.fireEvent('showSubjectTree');
					}
				}
			];
			me.callParent(arguments);
		}
	}
);