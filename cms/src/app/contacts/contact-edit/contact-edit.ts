import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contacts.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-edit.html',
  styleUrl: './contact-edit.css',
})
export class ContactEdit implements OnInit {
  originalContact: Contact | null = null;
  contact: Contact | null = null;
  groupContacts: Contact[] = [];
  editMode = false;
  id = '';

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      if (this.id == null) {
        this.editMode = false;
        this.contact = new Contact('', '', '', '', '', []);
        return;
      }

      this.originalContact = this.contactService.getContact(this.id);
      if (this.originalContact == null) {
        return;
      }

      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.originalContact.group) {
        this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const value = form.value;
    const newContact = new Contact(
      '',
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts,
    );

    if (this.editMode && this.originalContact) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigateByUrl('/contacts');
  }

  onCancel(): void {
    this.router.navigateByUrl('/contacts');
  }
}
