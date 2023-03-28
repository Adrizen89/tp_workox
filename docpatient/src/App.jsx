import React, { useState, useEffect } from 'react';
import generateICS from './ics';
import './App.css';

const medecins = [
  {
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@medecins.com',
    telephone: '01 23 45 67 89',
  },
  {
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@medecins.com',
    telephone: '01 23 45 67 90',
  },
  {
    nom: 'Leclerc',
    prenom: 'Pierre',
    email: 'pierre.leclerc@medecins.com',
    telephone: '01 23 45 67 91',
  },
];

function MyButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Installer l'application
    </button>
  );
}

function MyForm() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [description, setDescription] = useState('');

  const handleChange = (event) => {
    const index = event.target.value;
    const medecin = medecins[index];
    setNom(medecin.nom);
    setPrenom(medecin.prenom);
    setEmail(medecin.email);
    setTelephone(medecin.telephone);
  };

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallButton(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleClick = async () => {
    if (deferredPrompt !== null) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallButton(false);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const summary = `${nom} ${prenom}`;
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    generateICS({ startDate, endDate, summary, description });

    const mailtoLink = `mailto:${email}?subject=Rendez-vous&body=Bonjour ${prenom} ${nom},%0D%0A%0D%0AJe vous confirme notre rendez-vous le ${startDate}.%0D%0AVoici la description du rendez-vous : ${description}.%0D%0A%0D%0ACordialement.`;
    window.location.href = mailtoLink;
  };
    <div className="container">
      <form onSubmit={handleSubmit}>
      <label htmlFor="">
        Nom
        <input type="text" value={nom} onChange={(event) => setNom(event.target.value)} />
      </label>
      <br />
      <label htmlFor="">
        Prénom
        <input type="text" value={prenom} onChange={(event) => setPrenom(event.target.value)} />
      </label>
      <br />
      <label htmlFor="">Médecin</label>
      <br />
      <select onChange={handleChange}>
        <option value="">Choisissez un médecin</option>
        {medecins.map((medecin, index) => (
          <option key={index} value={index}>
            {`${medecin.nom} ${medecin.prenom} - ${medecin.telephone}`}
          </option>
        ))}
      </select>
      <br />
      <br />
      <label htmlFor="">
        Description du rendez-vous
        <input type="text" value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <br />
      <div className="card">
        <button type="submit">
          Prendre rendez-vous !
        </button>
      </div>
    </form>
    {isCompatible ? <MyButton onClick={handleClick}></MyButton> : null}
    </div>
}

export default MyForm;
