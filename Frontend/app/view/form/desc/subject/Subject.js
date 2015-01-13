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
		plugins: {
			ptype: 'fieldcontainerreplicator',
			groupName: 'classification-subject',
			btnStyle: {
				margin: '0 0 0 5px'
			}
		},
		listeners: {
			selectSubject: 'onSelectSubject',
			showSubjectTree: 'onShowSubjectTree'
		},

		translateText: {
			subject: 'Жанры',
			select: 'Выбрать'
		},

		/**
		 * @property {FBEditor.view.form.desc.subject.SubjectTree} Список жанров.
		 */
		subjectTree: null,

		initComponent: function ()
		{
			var me = this;

			me.subjectTree = Ext.getCmp('form-desc-subjectTree') || Ext.widget('form-desc-subjectTree');
			me.items = [
				{
					xtype: 'textfield',
					name: 'classification-subject',
					flex: 1,
					allowBlank: false,
					editable: false,
					fieldLabel: me.translateText.subject,
					labelAlign: 'right',
					labelWidth: 110,
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
					margin: '0 0 0 5',
					html: '<i class="fa fa-book"></i>',
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