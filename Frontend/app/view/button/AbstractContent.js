/**
 * Абстрактный класс для кнопок переключения контетна.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.AbstractContent',
	{
		extend: 'Ext.button.Button',
		width: '100%',
		enableToggle: true,
		toggleGroup: 'content'
	}
);