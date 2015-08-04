/**
 * Кнопка вставки главного заголовка всей книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.titlebody.TitleBody',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.title.Title',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.titlebody.TitleBodyController'
		],
		id: 'panel-toolstab-main-button-titlebody',
		xtype: 'panel-toolstab-main-button-titlebody',
		controller: 'panel.toolstab.main.button.titlebody',
		html: '<i class="fa fa-header fa-border"></i>',
		tooltip: 'Заголовок для всей книги',
		createOpts: {
			body: true
		}
	}
);